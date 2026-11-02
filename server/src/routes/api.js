import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { Case, CaseSecret, Evidence, Investigation, Suspect, Timeline } from '../models/index.js';
import { generateMystery } from '../services/geminiService.js';

const router = Router();
const generationLimit = rateLimit({ windowMs: 60_000, limit: 3, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many case requests. Please wait a minute and try again.', code: 'RATE_LIMITED' } });
const fail = (status, message, code='REQUEST_ERROR') => Object.assign(new Error(message), { status, code });
const objectId = value => mongoose.isValidObjectId(value);
function requireSession(req) {
  const id = req.get('x-session-id');
  if (!id || id.length > 100 || !/^[\w-]+$/.test(id)) throw fail(401, 'A valid guest session is required.', 'SESSION_REQUIRED');
  return id;
}
async function ownedInvestigation(id, sessionId) {
  if (!objectId(id)) throw fail(404, 'Investigation not found.', 'NOT_FOUND');
  const investigation = await Investigation.findOne({ _id: id, sessionId });
  if (!investigation) throw fail(404, 'Investigation not found.', 'NOT_FOUND');
  return investigation;
}

router.post('/cases/generate', generationLimit, async (req, res, next) => {
  try {
    const scenario = typeof req.body?.scenario === 'string' ? req.body.scenario.trim() : '';
    const difficulty = req.body?.difficulty;
    if (scenario.length < 30 || scenario.length > 2000) throw fail(400, 'Scenario must be between 30 and 2,000 characters.', 'VALIDATION_ERROR');
    if (!['easy','medium','hard'].includes(difficulty)) throw fail(400, 'Choose easy, medium, or hard difficulty.', 'VALIDATION_ERROR');
    const generated = await generateMystery(scenario, difficulty);
    const caseDoc = await Case.create({ caseTitle: generated.case.title, scenario, description: generated.case.description, difficulty, location: generated.case.location, incidentDate: generated.case.incidentDate, status: 'ready' });
    try {
      const suspectDocs = await Suspect.insertMany(generated.suspects.map(s => ({ caseId: caseDoc._id, name: s.name, age: s.age, occupation: s.occupation, background: s.background, motive: s.motive, alibi: s.alibi, relationshipToVictim: s.relationshipToVictim })));
      const suspectMap = new Map(generated.suspects.map((s,i) => [s.id, suspectDocs[i]._id]));
      const timelineDocs = await Timeline.insertMany(generated.timeline.map(t => ({ caseId: caseDoc._id, timestamp: t.timestamp, description: t.description, relatedSuspectIds: (t.relatedSuspectIds||[]).map(id=>suspectMap.get(id)).filter(Boolean) })));
      const timelineMap = new Map(generated.timeline.map((t,i)=>[t.id,timelineDocs[i]._id]));
      const evidenceDocs = await Evidence.insertMany(generated.evidence.map(e => ({ caseId: caseDoc._id, title: e.title, type: e.type, description: e.description, content: e.content||{}, timestamp: e.timestamp, relatedSuspectIds: (e.relatedSuspectIds||[]).map(id=>suspectMap.get(id)).filter(Boolean), relatedTimelineIds: (e.relatedTimelineIds||[]).map(id=>timelineMap.get(id)).filter(Boolean), relevance: e.relevance })));
      await CaseSecret.create({ caseId: caseDoc._id, culpritSuspectId: suspectMap.get(generated.culpritId), solution: generated.solution });
      return res.status(201).json({ success: true, caseId: String(caseDoc._id), status: 'ready' });
    } catch (error) {
      await Promise.all([Case.deleteOne({_id:caseDoc._id}),Suspect.deleteMany({caseId:caseDoc._id}),Timeline.deleteMany({caseId:caseDoc._id}),Evidence.deleteMany({caseId:caseDoc._id}),CaseSecret.deleteOne({caseId:caseDoc._id})]);
      throw error;
    }
  } catch (error) { next(error); }
});

router.get('/cases/:caseId', async (req,res,next)=>{try{if(!objectId(req.params.caseId))throw fail(404,'Case not found.','NOT_FOUND');const c=await Case.findById(req.params.caseId).lean();if(!c)throw fail(404,'Case not found.','NOT_FOUND');const [suspects,evidence]=await Promise.all([Suspect.countDocuments({caseId:c._id}),Evidence.countDocuments({caseId:c._id})]);res.json({success:true,case:{caseId:String(c._id),caseTitle:c.caseTitle,description:c.description,difficulty:c.difficulty,location:c.location,incidentDate:c.incidentDate,status:c.status,suspectCount:suspects,evidenceCount:evidence}});}catch(e){next(e);}});
router.get('/cases/:caseId/suspects',async(req,res,next)=>{try{if(!objectId(req.params.caseId))throw fail(404,'Case not found.','NOT_FOUND');const items=await Suspect.find({caseId:req.params.caseId}).sort({createdAt:1}).lean();if(!items.length&&!await Case.exists({_id:req.params.caseId}))throw fail(404,'Case not found.','NOT_FOUND');res.json({success:true,suspects:items});}catch(e){next(e);}});
router.get('/cases/:caseId/timeline',async(req,res,next)=>{try{if(!objectId(req.params.caseId))throw fail(404,'Case not found.','NOT_FOUND');const items=await Timeline.find({caseId:req.params.caseId}).sort({timestamp:1}).lean();if(!items.length&&!await Case.exists({_id:req.params.caseId}))throw fail(404,'Case not found.','NOT_FOUND');res.json({success:true,timeline:items});}catch(e){next(e);}});
router.get('/cases/:caseId/evidence/:evidenceId',async(req,res,next)=>{try{const item=await Evidence.findOne({_id:req.params.evidenceId,caseId:req.params.caseId}).lean();if(!item)throw fail(404,'Evidence not found.','NOT_FOUND');res.json({success:true,evidence:item});}catch(e){next(e);}});
router.get('/cases/:caseId/evidence',async(req,res,next)=>{try{if(!objectId(req.params.caseId))throw fail(404,'Case not found.','NOT_FOUND');const items=await Evidence.find({caseId:req.params.caseId}).sort({timestamp:1}).lean();if(!items.length&&!await Case.exists({_id:req.params.caseId}))throw fail(404,'Case not found.','NOT_FOUND');res.json({success:true,evidence:items});}catch(e){next(e);}});

router.post('/investigations',async(req,res,next)=>{try{const sessionId=requireSession(req);const {caseId}=req.body||{};if(!objectId(caseId)||!await Case.exists({_id:caseId,status:'ready'}))throw fail(404,'Ready case not found.','NOT_FOUND');let item=await Investigation.findOne({caseId,sessionId});if(!item)item=await Investigation.create({caseId,sessionId});res.status(201).json({success:true,investigationId:String(item._id),status:item.status});}catch(e){next(e);}});
router.get('/investigations/:id',async(req,res,next)=>{try{const item=await ownedInvestigation(req.params.id,requireSession(req));res.json({success:true,investigation:{investigationId:String(item._id),caseId:String(item.caseId),status:item.status,notes:item.notes,viewedEvidenceIds:item.viewedEvidenceIds,startedAt:item.startedAt}});}catch(e){next(e);}});
router.patch('/investigations/:id/notes',async(req,res,next)=>{try{const item=await ownedInvestigation(req.params.id,requireSession(req));if(item.status==='completed')throw fail(409,'This investigation is already complete.','CASE_COMPLETED');const raw=req.body?.notes;if(!Array.isArray(raw)||raw.length>100||raw.some(n=>typeof n!=='string'||n.length>5000))throw fail(400,'Notes must be a list of up to 100 text entries.','VALIDATION_ERROR');const now=new Date();item.notes=raw.map(content=>({content:content.slice(0,5000),createdAt:now,updatedAt:now}));await item.save();res.json({success:true,notes:item.notes});}catch(e){next(e);}});
router.post('/investigations/:id/accuse',async(req,res,next)=>{try{const item=await ownedInvestigation(req.params.id,requireSession(req));if(item.accusationSubmitted)throw fail(409,'An accusation has already been submitted.','DUPLICATE_ACCUSATION');const {suspectId,reasoning=''}=req.body||{};if(!objectId(suspectId)||typeof reasoning!=='string'||reasoning.length>1200)throw fail(400,'Choose a valid suspect and keep reasoning under 1,200 characters.','VALIDATION_ERROR');const suspect=await Suspect.findOne({_id:suspectId,caseId:item.caseId});if(!suspect)throw fail(400,'That suspect does not belong to this case.','INVALID_SUSPECT');const secret=await CaseSecret.findOne({caseId:item.caseId}).populate('culpritSuspectId');if(!secret)throw fail(500,'The solution for this case is unavailable.','SOLUTION_UNAVAILABLE');const updated=await Investigation.findOneAndUpdate({_id:item._id,sessionId:item.sessionId,accusationSubmitted:false},{selectedSuspectId:suspect._id,accusationSubmitted:true,isCorrect:String(suspect._id)===String(secret.culpritSuspectId._id),reasoning,status:'completed',completedAt:new Date()},{new:true});if(!updated)throw fail(409,'An accusation has already been submitted.','DUPLICATE_ACCUSATION');res.json({success:true,result:formatResult(updated,suspect,secret)});}catch(e){next(e);}});
router.get('/investigations/:id/result',async(req,res,next)=>{try{const item=await ownedInvestigation(req.params.id,requireSession(req));if(!item.accusationSubmitted)throw fail(409,'Submit your accusation to reveal the case solution.','SOLUTION_SEALED');const [suspect,secret]=await Promise.all([Suspect.findById(item.selectedSuspectId),CaseSecret.findOne({caseId:item.caseId}).populate('culpritSuspectId')]);if(!secret||!suspect)throw fail(500,'The final report is unavailable.','SOLUTION_UNAVAILABLE');res.json({success:true,result:formatResult(item,suspect,secret)});}catch(e){next(e);}});

function formatResult(investigation,selected,secret){const s=secret.solution||{};return{correct:Boolean(investigation.isCorrect),message:investigation.isCorrect?'Case solved!':'The evidence tells a different story.',selectedSuspect:selected.name,actualCulprit:secret.culpritSuspectId.name,explanation:s.culpritExplanation,motiveExplanation:s.motiveExplanation,eventSequence:s.eventSequence,evidenceReasoning:s.evidenceReasoning||[]};}
export default router;
