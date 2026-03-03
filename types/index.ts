

export type IncidentCategory =
  | "pothole"
  | "garbage"
  | "streetlight"
  | "road_damage"
  | "waterlogging"
  | "encroachment"
  | "other";

export type IncidentStatus =
  | "reported"
  | "verified"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "closed";

export type UserRole = "citizen" | "worker" | "admin" | "pending_worker";

export type SeverityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;


// LOCATION


export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}


// AI ANALYSIS


export interface AIAnalysisResult {
  category: IncidentCategory;
  severity: SeverityLevel;
  isSpam: boolean;
  spamReason: "stock_photo" | "indoor_image" | "unrelated" | "low_quality" | null;
  confidence: number;
  description: string;
}

export interface AIResolutionResult {
  resolved: boolean;
  confidence: number;
  notes: string;
  verifiedAt: Date;
}


// INCIDENT


export interface IIncident {
  _id: string;
  reportedBy: string;
  location: GeoJSONPoint;
  beforeS3Key: string;
  afterS3Key?: string;
  categoryHint: IncidentCategory;
  userDescription?: string;
  aiAnalysis: AIAnalysisResult;
  aiResolution?: AIResolutionResult;
  status: IncidentStatus;
  priorityScore: number;
  upvotes: number;
  assignedTo?: string;
  assignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}


// USER


export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  reportCount: number;
  resolvedCount: number;
  spamCount: number;
  createdAt: Date;
  updatedAt: Date;
}


// API TYPES


export interface CreateIncidentRequest {
  s3Key: string;
  lat: number;
  lng: number;
  categoryHint: IncidentCategory;
  userDescription?: string;
}

export interface CreateIncidentResponse {
  success: boolean;
  incidentId?: string;
  isDuplicate?: boolean;
  existingIncidentId?: string;
  message: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  s3Key: string;
  expiresIn: number;
}

export interface ResolveIncidentRequest {
  afterS3Key: string;
}

export interface ResolveIncidentResponse {
  success: boolean;
  resolved: boolean;
  confidence: number;
  notes: string;
  message: string;
}


// DASHBOARD


export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  incidentId: string;
  category: IncidentCategory;
  status: IncidentStatus;
}

export interface AnalyticsSummary {
  totalIncidents: number;
  resolvedThisMonth: number;
  avgResolutionTime: number;
  criticalPending: number;
  resolutionRate: number;
}


// PAGINATION & FILTERS


export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IncidentFilters {
  page?: number;
  limit?: number;
  status?: IncidentStatus;
  category?: IncidentCategory;
  assignedTo?: string;
  sortBy?: "priorityScore" | "createdAt" | "severity";
  sortOrder?: "asc" | "desc";
}