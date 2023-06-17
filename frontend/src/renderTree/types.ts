export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const enum Gender {
  male = 'male',
  female = 'female',
}

export const enum RelType {
  blood = 'blood',
  married = 'married',
  divorced = 'divorced',
  adopted = 'adopted',
  half = 'half',
}

export const enum FamilyType {
  root = 'root',
  child = 'child',
  parent = 'parent',
}

export type Family = {
  readonly id: number;
  readonly type: FamilyType;
  readonly main: boolean;
  /** Parent family ID */
  pid?: number;
  /** Child family ID */
  cid?: number;
  /** Family's left coordinate */
  X: number;
  /** Family's top coordinate */
  Y: number;
  parents: readonly Unit[];
  children: readonly Unit[];
}

export type Unit = {
  /** Family ID */
  readonly fid: number;
  /** Is child unit */
  readonly child: boolean;
  readonly nodes: readonly Node[];
  pos: number;
}

export type Size = Readonly<{
  width: number;
  height: number;
}>

export type Relation = Readonly<{
  id: string;
  type: RelType;
}>

export type Node = Readonly<{
  id: string;
  gender: Gender;
  parents: readonly Relation[];
  children: readonly Relation[];
  siblings: readonly Relation[];
  spouses: readonly Relation[];
  placeholder?: boolean;
  infoNode?: InfoNode;
}>

export type ExtNode = Node & Readonly<{
  top: number;
  left: number;
  hasSubTree: boolean;
}>

export type Connector = readonly [x1: number, y1: number, x2: number, y2: number];

export type RelData = Readonly<{
  canvas: Size;
  families: readonly Family[];
  nodes: readonly ExtNode[];
  connectors: readonly Connector[];
}>

export type Options = Readonly<{
  rootId: string;
  placeholders?: boolean;
}>

export type InfoNode = {
  image?: string
  firstName?: string,
  middleName?: string,
  lastName?: string,
  occupation?: string,
  location?: string,
  birthDate?: string
  liveEvents?: readonly LiveEvent[];
  personDocuments?: readonly PersonDocuments[];
  description?: string
}
export type LiveEvent = Readonly<{
  date?: string,
  place?: string,
  type: LiveEventType 
}>

export const enum LiveEventType {
  birth = 'birth',
  death = 'death',
  marrige = 'marrige',
  other = 'other'
}

export type PersonDocuments = Readonly<{
  url?: string,
}>
