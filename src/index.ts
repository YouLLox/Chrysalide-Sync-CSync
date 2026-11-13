import { syncStudentProfile } from './services/core/student.service';
import { syncScheduleEvents } from './services/core/event.service';
import { syncGrades } from './services/core/grades.service'; // À adapter
import { syncSyllabus } from './services/core/syllabus.service'; // À adapter
import { setAurigaSession } from './services/auriga/client';

async function testExtraction() {
    console.log("--- DÉMARRAGE DE L'EXTRACTION ---");

    const token = 'YOUR_TOKEN';

    if (!token) {
        console.error("❌ [ERREUR CRITIQUE] Impossible de démarrer : le token de session est manquant.");
        return;
    }

    setAurigaSession(token);
    console.log("✅ Session Auriga configurée.");

    try {
        // 1. Profil étudiant
        console.log("\n[1/4] Extraction du profil étudiant...");
        const student = await syncStudentProfile();
        console.log(`✅ Profil récupéré : ${student.firstName} ${student.lastName}`);

        // 2. Emploi du temps
        console.log("\n[2/4] Extraction de l'emploi du temps...");
        const events = await syncScheduleEvents();
        console.log(`✅ Emploi du temps : ${events.length} événements.`);

        // 3. Notes
        console.log("\n[3/4] Extraction des notes...");
        const grades = await syncGrades();
        console.log(`✅ Notes : ${grades.length} éléments trouvés.`);
        if (grades.length > 0) {
            const firstGrade = grades[0];
            console.log("Aperçu de la première note :");
            // Adapte ces propriétés à ton interface Grade
            console.log(`  - Évaluation : ${firstGrade.code || 'N/A'}`);
            console.log(`  - Note : ${firstGrade.value || 'N/A'}`);
        }

        // 4. Syllabus
        console.log("\n[4/4] Extraction du syllabus...");
        const syllabus = await syncSyllabus();
        console.log(`✅ Syllabus : ${syllabus.length} modules/cours trouvés.`);
        if (syllabus.length > 0) {
            const firstSyllabusItem = syllabus[0];
            console.log("Aperçu du premier élément du syllabus :");
            // Adapte ces propriétés à ton interface Syllabus
            console.log(`  - Module : ${firstSyllabusItem.name || 'N/A'}`);
            console.log(`  - Description : ${firstSyllabusItem.description || 'N/A'}`);
        }

        console.log("\n--- TEST TERMINÉ SANS ERREUR CRITIQUE ---");

    } catch (error) {
        console.error("\n❌ [ÉCHEC] L'extraction a rencontré une erreur :");
        console.error(error instanceof Error ? error.message : error);
    }
}

// Exécution du script
testExtraction().then(()=> console.log("Script terminé.")).catch(err => console.error("Erreur inattendue :", err));
