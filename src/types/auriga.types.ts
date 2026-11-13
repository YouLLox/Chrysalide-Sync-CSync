// ==========================================
// 1. TYPES DE BASE ET UTILITAIRES
// ==========================================

export interface AurigaI18nString {
    en?: string;
    fr?: string | null;
    es?: string | null;
}

export interface AurigaIdReference {
    id: number;
}

export interface AurigaGenericEntity {
    id: number;
    code: string;
    caption: AurigaI18nString;
    longCaption?: AurigaI18nString;
    isTitle?: boolean;
}

// ==========================================
// 2. TYPES PARTAGÉS (DATAGRID / MATRICES)
// ==========================================

export interface AurigaColumnOperationParameter {
    function: string;
    column: string;
    value: unknown | null;
    index: number;
}

export interface AurigaColumnOperation {
    operation: string;
    parameters: AurigaColumnOperationParameter[];
}

export interface AurigaColumn {
    guid: string;
    visible: boolean;
    path: string | null;
    api: string | null;
    field: string;
    label: AurigaI18nString | Record<string, never>;
    defaultLabel: AurigaI18nString | Record<string, never>;
    modelName: string | null;
    modelDestName: string | null;
    isReverted: boolean | null;
    calculated?: boolean;
    type: string;
    order: number | null;
    orderGlobal: number | null;
    excluded: boolean | null;
    operations: AurigaColumnOperation[];
    isDisplayedInSelect: boolean;
    multilingual: boolean | null;
    isCustom: boolean | null;
    isParameterized: boolean | null;
    children: AurigaColumn[];
}

// ==========================================
// 3. GÉOGRAPHIE ET ADRESSES
// ==========================================

export interface AurigaCountry {
    id: number;
    iso639_1Code: string;
    iso639_2Code: string;
    isoNumCode: string;
    siseCode: number;
    name: AurigaI18nString;
    includeEu: boolean;
    isANationality: boolean;
    continent: AurigaI18nString;
}

export interface AurigaFrenchCity {
    id: number;
    code: string;
    caption: AurigaI18nString;
    department: string;
    ncc: string;
    nccCustom: string;
}

export interface AurigaFrenchDepartment {
    id: number;
    code: string;
    caption: AurigaI18nString;
}

export interface AurigaAddress {
    id: number;
    street1: string;
    street2?: string;
    city: string;
    postcode: string;
    addressType: AurigaGenericEntity;
    country: AurigaCountry;
    frenchCity?: AurigaFrenchCity;
    frenchDepartment?: AurigaFrenchDepartment;
    metaModelCode: string;
}

// ==========================================
// 4. PROFIL ÉTUDIANT (PERSON)
// ==========================================

export interface AurigaCustomAttributes {
    RL1_Town?: string;
    RL1_AddressC?: string;
    RL1_Name?: string;
    RL2_FirstName?: string;
    GF1_Country?: AurigaIdReference;
    RL2_Mail?: string;
    EntryClass?: number;
    LOGIN?: string;
    RL2_Postcode?: string;
    ID18?: string;
    GF1_Mail?: string;
    GF1_FirstName?: string;
    RelationRL1?: AurigaIdReference;
    RL2_Country?: AurigaIdReference;
    RelationRL2?: AurigaIdReference;
    Parent2_Civility?: AurigaIdReference;
    RL1_Mail?: string;
    RL1_Country?: AurigaIdReference;
    RL2_AddressC?: string;
    RL1_FirstName?: string;
    CustomerAccount?: string;
    RelationGF1?: AurigaIdReference;
    SchoolNumber?: number;
    UID?: number;
    RL1_Postcode?: string;
    RL2_Town?: string;
    GF1_Town?: string;
    RL2_Name?: string;
    GF1_Name?: string;
    GF1_Address?: string;
}

export interface AurigaDocument {
    id: number;
    objectId: number;
    fileName: string;
    fileExtension: string;
    fileSize: number;
    isRelatedToObjectOnly: boolean;
    creationTimestamp: string;
    editionTimestamp: string;
    metaModelCode: string;
    metaAttributeCode: string;
    documentType: {
        id: number;
        code: string;
        caption: AurigaI18nString;
        maximumDocument: number;
        maximumDocumentSize: number;
        isPhoto: boolean;
        filter: string;
    };
    documentStatus: AurigaGenericEntity;
}

export interface AurigaContactDetail {
    id: number;
    index: number;
    contactInformation: string;
    person: Partial<AurigaPerson>;
    contactType: AurigaGenericEntity;
}

export interface AurigaPersonCountryNationality {
    id: number;
    person: Partial<AurigaPerson>;
    country: AurigaCountry;
}

export interface AurigaPersonProfileItem {
    id: number;
    person: Partial<AurigaPerson>;
    profile: {
        id: number;
        code: string;
        caption: AurigaI18nString;
        isAdmin: boolean;
    };
}

export interface AurigaPersonSharingDomain {
    id: number;
    person: Partial<AurigaPerson>;
    sharingDomain: AurigaGenericEntity;
}

export interface AurigaPerson {
    id: number;
    customAttributes: AurigaCustomAttributes;
    currentLastName: string;
    officialLastName: string;
    currentFirstName: string;
    officialFirstName: string;
    birthDate: string;
    cityOfBirth: string;
    frenchIne: string;
    keycloakUuid: string;
    login: string;
    accessDenied: boolean;
    isFrontDenied: boolean;
    isLearner: boolean;
    isInstructor: boolean;
    isCandidate: boolean;
    isStaff: boolean;
    isTopLevelAthlete: boolean;
    isStatusOfDisabledWorker: boolean;
    doNotContactAnymore: boolean;
    partTime: boolean;
    higherEducationEntryYear: number;
    institutionEntryYear: number;
    bacYear: number;
    countryOfBirth?: AurigaCountry;
    frenchCityOfBirth?: AurigaFrenchCity;
    frenchDepartmentOfBirth?: AurigaFrenchDepartment;
    personTitle?: AurigaGenericEntity;
    gender?: AurigaGenericEntity;
    parent1SocioProfessionalClass?: Record<string, unknown>;
    parent2SocioProfessionalClass?: Record<string, unknown>;
    parent1RelationshipNature?: Record<string, unknown>;
    parent2RelationshipNature?: Record<string, unknown>;
    site?: { timezone: Record<string, unknown> };
    field?: Record<string, unknown>;
    position?: Record<string, unknown>;
    higherAcademicLevelReached?: Record<string, unknown>;
    socialRegime?: Record<string, unknown>;
    siseBacOption1?: AurigaGenericEntity;
    siseBacOption2?: AurigaGenericEntity;
    siseBacSeries?: AurigaGenericEntity;
    bacCountry?: Record<string, unknown>;
    bacFrenchDepartment?: AurigaFrenchDepartment;
    bacEntity?: { entityType: Record<string, unknown> };
    siseTyprepa?: Record<string, unknown>;
    siseSitupre?: AurigaGenericEntity;
    siseDipder?: AurigaGenericEntity;
    siseCurpar?: Record<string, unknown>;
    siseLanguage1?: AurigaGenericEntity;
    siseLanguage2?: AurigaGenericEntity;
    siseLanguage3?: Record<string, unknown>;
    entityMembership?: Record<string, unknown>;
    documents?: AurigaDocument[];
    addresses?: AurigaAddress[];
    contactDetails?: AurigaContactDetail[];
    personCountryNationalities?: AurigaPersonCountryNationality[];
    personProfiles?: AurigaPersonProfileItem[];
    personSharingDomains?: AurigaPersonSharingDomain[];
}

export interface AurigaRawProfile {
    subject: string;
    name: string;
    person: AurigaPerson;
}

// ==========================================
// 5. NOTES (GRADES)
// ==========================================

export type AurigaGrade = Array<string | number | boolean | null>;

export interface AurigaGradesContent {
    columns: AurigaColumn[];
    lines: Array<AurigaGrade>;
}

export interface AurigaRawGradesResponse {
    currentPage: number;
    pageSize: number;
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
    content: AurigaGradesContent;
    dataviz: Record<string, unknown> | null;
}

// ==========================================
// 6. SYLLABUS
// ==========================================

export interface AurigaSyllabusContent {
    columns: AurigaColumn[];
    lines: Array<Array<string | number | boolean | null | AurigaI18nString>>;
}

export interface AurigaRawSyllabusResponse {
    currentPage: number;
    pageSize: number;
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
    content: AurigaSyllabusContent;
    dataviz: Record<string, unknown> | null;
}

export interface AurigaSyllabusAssessmentComponent {
    id: number;
    index: number;
    description: AurigaI18nString;
    weighting: number;
    examType: {
        id: number;
        code: string;
        caption: AurigaI18nString;
    };
}

export interface AurigaSyllabusPersonNode {
    id: number;
    person: {
        id: number;
        currentLastName: string;
        currentFirstName: string;
    };
}

export interface AurigaSyllabusSiteNode {
    id: number;
    site: {
        code: string;
        caption: AurigaI18nString;
    };
}

export interface AurigaDetailedSyllabus {
    id: number;
    code: string;
    caption: AurigaI18nString;
    outline: AurigaI18nString;
    duration: number;
    customAttributes: {
        miniScore?: number;
        UE?: { id: number }[];
    };
    syllabusAssessmentComponents?: AurigaSyllabusAssessmentComponent[];
    syllabusResponsibles?: AurigaSyllabusPersonNode[];
    syllabusInstructorEditors?: AurigaSyllabusPersonNode[];
    syllabusSites?: AurigaSyllabusSiteNode[];
}

// ==========================================
// 7. EMPLOI DU TEMPS (SCHEDULE / INTERVENTIONS)
// ==========================================

export interface AurigaTimezone {
    id: number;
    code: string;
    name: string;
    description: string;
    abbreviation: string;
    utcOffset: number;
    dst: boolean;
    utcOffsetWithDst: number;
}

export interface AurigaInterventionStatus {
    id: number;
    code: string;
    caption: AurigaI18nString;
    isDisplayedInSchedules: boolean;
    isBillable: boolean;
    isResourceConflictsEnabled: boolean;
    isLearnerConflictsEnabled: boolean;
    isInstructorConflictsEnabled: boolean;
    isHoursTaughtCountedInPrc: boolean;
    isHoursTaughtCountedInWorkloadPlan: boolean;
    isHoursTaughtExportedToPayroll: boolean;
    isPartOfAttendanceLists: boolean;
    toSchedule: boolean;
    isAccessAttendanceListsDisabled: boolean;
}

export interface AurigaActivityType {
    id: number;
    code: string;
    caption: AurigaI18nString;
}

export interface AurigaInstructorContext {
    id: number;
    currentFirstName: string;
    currentLastName: string;
}

export interface AurigaInterventionInstructor {
    id: number;
    person: AurigaInstructorContext;
}

export interface AurigaPartialIntervention {
    id: number;
    externalCode?: Record<string, string>;
    startDateTime?: string;
    endDateTime?: string;
    actualDuration?: number;
    accountedDuration?: number;
}

export interface AurigaPedagogicalUnit {
    id: number;
    customAttributes: Record<string, unknown>;
    code: string;
    caption: AurigaI18nString;
}

export interface AurigaInterventionPedagogicalUnit {
    id: number;
    intervention: AurigaPartialIntervention;
    pedagogicalUnit: AurigaPedagogicalUnit;
}

export interface AurigaPopulation {
    id: number;
    customAttributes: Record<string, unknown>;
    externalCode: Record<string, string>;
    code: string;
    caption: AurigaI18nString;
    populationType: {
        id: number;
        code: string;
        caption: AurigaI18nString;
    };
}

export interface AurigaInterventionPopulation {
    id: number;
    intervention: AurigaPartialIntervention;
    population: AurigaPopulation;
}

export interface AurigaResource {
    id: number;
    customAttributes: Record<string, unknown>;
    code: string;
    caption: AurigaI18nString;
    description: AurigaI18nString;
    isRoom: boolean;
    totalCapacity: number;
    examCapacity: number;
    floor: number;
    isAccessibleForDisablePeople: boolean;
    resourceType: {
        id: number;
        code: string;
        caption: AurigaI18nString;
        isManagingConflictsEnabled: boolean;
    };
}

export interface AurigaInterventionResource {
    id: number;
    intervention: AurigaPartialIntervention;
    resource: AurigaResource;
}

export interface AurigaInterventionProgram {
    intervention: { id: number };
    program: {
        id: number;
        code: string;
        caption: AurigaI18nString;
    };
}

export interface AurigaIntervention {
    id: number;
    startDateTime: string;
    endDateTime: string;
    actualDuration: number;
    accountedDuration?: number;
    timezone: AurigaTimezone;
    interventionStatus: AurigaInterventionStatus;
    activityType: AurigaActivityType;
    field: Record<string, unknown>;
    interventionInstructors: AurigaInterventionInstructor[];
    interventionPedagogicalUnits: AurigaInterventionPedagogicalUnit[];
    interventionPopulations: AurigaInterventionPopulation[];
    interventionResources: AurigaInterventionResource[];
    interventionPrograms: AurigaInterventionProgram[];
    isExam: boolean;
}

export interface AurigaRawScheduleResponse {
    interventions: AurigaIntervention[];
    unavailabilities: Record<string, unknown>[];
}

// ==========================================
// 8. SYLLABUS CATALOGUE
// ==========================================

export interface AurigaPeriodObject {
    id: number;
    startDate: string;
    endDate: string;
    code: string;
    caption: AurigaI18nString;
    isScheduleForbidden: boolean;
    periodType: {
        id: number;
        code: string;
        caption: AurigaI18nString;
    };
}

export interface AurigaFormFieldRule {
    validator: string;
}

export interface AurigaFormRemoteValue {
    api: string;
    favorite?: {
        defaultFavorite?: boolean;
        code?: string;
        enabledForeignKeyDisplay?: boolean;
        targetPath?: string;
    };
    labelFieldName?: string;
    order?: string;
    sortBy?: string[];
    modelPath?: string[];
}

// Typage récursif complexe pour les éléments du formulaire dynamique
export interface AurigaDesignField {
    fieldName?: string;
    componentType: string; // 'multiple-select', 'spacer', 'text', 'date-picker', 'field-table', etc.
    width?: string;
    label?: AurigaI18nString | Record<string, never>;
    placeholder?: AurigaI18nString | Record<string, never>;
    helpText?: AurigaI18nString | Record<string, never>;
    unit?: AurigaI18nString | Record<string, never>;
    hidden?: boolean;
    multiLang?: boolean;
    multiLangDisplay?: boolean;
    custom?: boolean;
    readonly?: boolean;
    applyTimeShift?: boolean;
    lineHr?: boolean;
    isGhost?: boolean;
    icon?: string;
    modelCode?: string;
    orderByColumn?: string;
    decimals?: number;
    remoteValue?: AurigaFormRemoteValue;
    defaultValue?: {
        hardValue?: string;
        fromApi?: Array<{
            api: string;
            modelPath?: string[];
        }>;
    };
    linkedFieldProperties?: {
        parentFieldPath: string[];
        parentField: string;
    };
    rules?: AurigaFormFieldRule[];
    fieldTableStructure?: AurigaDesignField[]; // Récursivité pour les tableaux dans le formulaire
}

export interface AurigaDesignChapter {
    title: AurigaI18nString;
    lines: AurigaDesignField[][]; // Matrice 2D : Lignes contenant des colonnes de champs
    hidden: boolean;
    rules: unknown[];
    isOpen: boolean;
    isCustom?: boolean;
}

export interface AurigaDesignDefinition {
    api: string;
    chapters: AurigaDesignChapter[];
    header: {
        title: {
            modelPath: string[];
            multiLangDisplay: boolean;
        };
        subTitle: {
            modelPath: string[];
            multiLangDisplay: boolean;
        };
    };
}

export interface AurigaFormDefinition {
    id: number;
    code: string;
    caption: AurigaI18nString;
    designDefinition: AurigaDesignDefinition;
    isLocked: boolean;
}

export interface AurigaCatalogObligation {
    id: number;
    customAttributes: Record<string, unknown>;
    code: string;
    caption: AurigaI18nString;
    isActive: boolean;
    isDisplayedOnTranscripts: boolean;
    isCrpDuplicable: boolean;
}

export interface AurigaCatalogObligationLink {
    id: number;
    courseCatalogDefinition: {
        id: number;
        code: string;
        caption: AurigaI18nString;
        isLearner: boolean;
        isInstructor: boolean;
        isCandidate: boolean;
        isNonAuthenticated: boolean;
    };
    obligation: AurigaCatalogObligation;
}

export interface AurigaCatalogDefinitionItem {
    id: number;
    queryFilter: Record<string, unknown>;
    code: string;
    caption: AurigaI18nString;
    isLearner: boolean;
    isInstructor: boolean;
    isCandidate: boolean;
    isNonAuthenticated: boolean;
    period: AurigaPeriodObject;
    completedForm: AurigaFormDefinition;
    reducedForm: AurigaFormDefinition;
    courseCatalogDefinitionObligations: AurigaCatalogObligationLink[];
}

export interface AurigaCatalogDefinitionsResponse {
    currentPage: number;
    pageSize: number;
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
    url: string;
    content: AurigaCatalogDefinitionItem[];
}
