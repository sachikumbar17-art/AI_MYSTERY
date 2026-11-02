import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const CaseSchema = new Schema({
  caseTitle: { type: String, required: true }, scenario: { type: String, required: true }, description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy','medium','hard'], required: true }, location: { type: String, required: true },
  incidentDate: { type: Date, required: true }, status: { type: String, enum: ['ready','failed'], default: 'ready' },
}, { timestamps: true });
const SuspectSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, name: { type: String, required: true }, age: Number, occupation: String, background: String, motive: String, alibi: String, relationshipToVictim: String }, { timestamps: true });
const EvidenceSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, title: { type: String, required: true }, type: { type: String, enum: ['chat','image','cctv','document','other'], required: true }, description: String, content: Schema.Types.Mixed, assetUrl: String, timestamp: Date, relatedSuspectIds: [{ type: Schema.Types.ObjectId, ref: 'Suspect' }], relatedTimelineIds: [{ type: Schema.Types.ObjectId, ref: 'Timeline' }], relevance: { type: String, enum: ['critical','supporting','misleading'] } }, { timestamps: true });
const TimelineSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, timestamp: { type: Date, required: true }, description: { type: String, required: true }, relatedSuspectIds: [{ type: Schema.Types.ObjectId, ref: 'Suspect' }], relatedEvidenceIds: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }] });
const InvestigationSchema = new Schema({ sessionId: { type: String, required: true, index: true }, caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, status: { type: String, enum: ['active','completed'], default: 'active' }, viewedEvidenceIds: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }], notes: [{ content: String, createdAt: Date, updatedAt: Date }], selectedSuspectId: { type: Schema.Types.ObjectId, ref: 'Suspect' }, accusationSubmitted: { type: Boolean, default: false }, isCorrect: Boolean, reasoning: String, startedAt: { type: Date, default: Date.now }, completedAt: Date });
const SecretSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, unique: true, index: true }, culpritSuspectId: { type: Schema.Types.ObjectId, ref: 'Suspect', required: true }, solution: { type: Schema.Types.Mixed, required: true } }, { timestamps: true });

export const Case = model('Case', CaseSchema);
export const Suspect = model('Suspect', SuspectSchema);
export const Evidence = model('Evidence', EvidenceSchema);
export const Timeline = model('Timeline', TimelineSchema);
export const Investigation = model('Investigation', InvestigationSchema);
export const CaseSecret = model('CaseSecret', SecretSchema);
