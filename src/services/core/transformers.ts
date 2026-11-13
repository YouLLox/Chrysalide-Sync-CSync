import {
    AurigaDetailedSyllabus,
    AurigaGrade,
    AurigaI18nString, AurigaIntervention,
    AurigaRawProfile
} from '../../types/auriga.types';
import {
    Subject,
    Evaluation,
    Grade,
    Student,
    Address,
    Rank,
    Gender,
    Event,
    EventType, ClassRoom, Teacher, EventStatus, EventName
} from '../../types/chrysalide.types';

/**
 * Extracts string from Auriga's i18n object.
 * Prioritizes French, then English, then Spanish.
 */
function getI18nText(i18n?: AurigaI18nString | null): string {
    if (!i18n) return '';
    return i18n.fr || i18n.en || i18n.es || '';
}

/**
 * Transforms the detailed Auriga syllabus response into a local Subject object.
 */
export function transformDetailedSyllabus(raw: AurigaDetailedSyllabus): Subject {
    // 1. Map assessment components to local Evaluation type
    const evaluations: Evaluation[] = (raw.syllabusAssessmentComponents || []).map(comp => ({
        id: comp.id,
        description: getI18nText(comp.description),
        coefficient: comp.weighting,
        type: comp.examType.code as any, // Cast to your local EvaluationType enum
    }));

    const campus: string[] = (raw.syllabusSites || []).map(siteNode =>
        getI18nText(siteNode.site.caption)
    );

    const formatPerson = (node: { person: { currentFirstName: string; currentLastName: string } }) =>
        `${node.person.currentFirstName} ${node.person.currentLastName}`;

    const teacher: string[] = (raw.syllabusInstructorEditors || []).map(formatPerson);
    const referent: string[] = (raw.syllabusResponsibles || []).map(formatPerson);

    const durationHours = (raw.duration || 0) / 3600;

    const ueId = raw.customAttributes?.UE?.[0]?.id || 0;

    const semesterMatch = raw.code.match(/_S(\d{2})/);
    const semester = semesterMatch ? parseInt(semesterMatch[1], 10) : 0;

    return {
        id: raw.code,
        name: getI18nText(raw.caption),
        semester: semester,
        coefficient: 0,
        minimalGrade: raw.customAttributes?.miniScore || 10,
        ue: ueId,
        description: getI18nText(raw.outline),
        evaluations: evaluations,
        campus: campus,
        duration: durationHours,
        teacher: teacher,
        referent: referent,
    };
}

export function transformGrades(raw: AurigaGrade): Grade {
    const semesterMatch = (raw[3] as string).match(/_S(\d{2})/);
    const semester = semesterMatch ? parseInt(semesterMatch[1], 10) : 0;

    const rawValue = String(raw[1]).replace(',', '.');

    return {
        id: raw[0] as number,
        code: raw[3] as string,
        semester: semester,
        coefficient: raw[2] as number,
        type: raw[4] as string,
        value: Number(rawValue),
        isAbsent: false,
        absentReason: null,
        appreciation: null,
    };
}

function getAccessLevel(raw: AurigaRawProfile): Rank | null {
    if (raw.person.isLearner) {
        return 'student';
    }
    if (raw.person.isInstructor) {
        return 'teacher';
    }
    if (raw.person.isCandidate) {
        return 'candidate';
    }
    if (raw.person.isStaff) {
        return 'admin';
    }
    return null;
}

function getGender(raw: AurigaRawProfile): Gender {
    if (raw.person.gender.code == 'M') {
        return 'male';
    }
    if (raw.person.gender.code == 'F') {
        return 'female';
    }
    return 'other';
}

export function transformProfil(raw: AurigaRawProfile): Student {
    const address: Address = {
        street: `${raw.person.addresses?.[0]?.street1 || ''} (${raw.person.addresses?.[0]?.street2 || ''})`.trim(),
        city: raw.person.addresses?.[0]?.city || '',
        postalCode: raw.person.addresses?.[0]?.postcode || '',
    };

    const status: Rank | null = getAccessLevel(raw);
    const gender: Gender = getGender(raw);

    const parentContactInfo = raw.person.contactDetails?.[0]?.person?.customAttributes;

    return {
        id: raw.person.customAttributes?.UID,
        login: raw.person.customAttributes?.LOGIN,
        schoolMail: raw.person.login,
        lastName: raw.person.currentLastName,
        firstName: raw.person.currentFirstName,
        phone: raw.person.contactDetails?.[2]?.contactInformation || '',
        address: address,
        birthDate: raw.person.birthDate,
        cityOfBirth: raw.person.cityOfBirth,
        status: status,
        entryYear: raw.person.contactDetails?.[0]?.person?.institutionEntryYear,
        bacYear: raw.person.contactDetails?.[0]?.person?.bacYear,
        gender: gender,
        bacOptions: [
            raw.person.siseBacOption1?.caption?.fr,
            raw.person.siseBacOption2?.caption?.fr
        ].filter(Boolean),
        parents: {
            parent1: {
                lastName: parentContactInfo?.RL1_Name || '',
                firstName: parentContactInfo?.RL1_FirstName || '',
                address: {
                    street: parentContactInfo?.RL1_AddressC || '',
                    city: parentContactInfo?.RL1_Town || '',
                    postalCode: parentContactInfo?.RL1_Postcode || '',
                },
                mail: parentContactInfo?.RL1_Mail || '',
            },
            parent2: {
                lastName: parentContactInfo?.RL2_Name || '',
                firstName: parentContactInfo?.RL2_FirstName || '',
                address: {
                    street: parentContactInfo?.RL2_AddressC || '',
                    city: parentContactInfo?.RL2_Town || '',
                    postalCode: parentContactInfo?.RL2_Postcode || '',
                },
                mail: parentContactInfo?.RL2_Mail || '',
            }
        }
    };
}

function getEventType(raw: AurigaIntervention): EventType {
    if (raw.activityType.code == 'TD') {
        return 'TD';
    }
    if (raw.activityType.code == 'CM') {
        return 'CM';
    }
    if (raw.activityType.code == 'EX') {
        return 'EXM';
    }
    return 'other';
}

function getEventStatus(raw: AurigaIntervention): EventStatus {
    if (raw.interventionStatus.code == 'PLANIFIE') {
        return 'planned';
    }
    return 'cancelled';
}

export function transformEvent(raw: AurigaIntervention): Event {
    const pedagogicalUnits = Array.isArray(raw.interventionPedagogicalUnits) ? raw.interventionPedagogicalUnits : [];
    const resources = Array.isArray(raw.interventionResources) ? raw.interventionResources : [];
    const instructors = Array.isArray(raw.interventionInstructors) ? raw.interventionInstructors : [];
    const populations = Array.isArray(raw.interventionPopulations) ? raw.interventionPopulations : [];

    const primaryUnit = pedagogicalUnits[0]?.pedagogicalUnit;
    const fallbackProgramCode = raw.interventionPrograms?.[0]?.program?.code;

    const studentsList = populations.map(p => (p.population?.code ? String(p.population.code) : String(p.population?.id || ''))).filter(Boolean);

    const campusList = resources.map(r => r.resource?.caption?.fr || r.resource?.caption?.en || '').filter(Boolean);

    return {
        id: raw.id,
        type: getEventType(raw),
        code: primaryUnit?.code || fallbackProgramCode || `event-${raw.id}`,
        name: pedagogicalUnits.map(unit => ({
            fr: unit.pedagogicalUnit?.caption?.fr || '',
            en: unit.pedagogicalUnit?.caption?.en || '',
        } as unknown as EventName)),
        startDate: raw.startDateTime,
        endDate: raw.endDateTime,
        students: studentsList,
        campus: campusList,
        classroom: resources.map(resource => ({
            id: resource.id,
            code: resource.resource?.code || '',
            name: resource.resource?.caption?.fr || '',
            floor: resource.resource?.floor || 0,
            capacity: {
                total: resource.resource?.totalCapacity || 0,
                exam: resource.resource?.examCapacity || 0,
            },
            type: {
                id: String(resource.resource?.resourceType?.id || ''),
                name: resource.resource?.resourceType?.caption?.fr || '',
            }
        } as unknown as ClassRoom)),
        duration: raw.actualDuration,
        teacher: instructors.map(instructor => ({
            firstName: instructor.person?.currentFirstName || '',
            lastName: instructor.person?.currentLastName || '',
            } as unknown as Teacher)),
        status: getEventStatus(raw),
        examen: Boolean(raw.isExam),
    } as unknown as Event;
}
