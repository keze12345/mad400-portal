import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

// ─── Firebase Setup ───────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBV9mcwL9WDjV2ASeshnPTF6kEsQ5Y1YSM",
  authDomain: "mad400-portal.firebaseapp.com",
  projectId: "mad400-portal",
  storageBucket: "mad400-portal.firebasestorage.app",
  messagingSenderId: "314059861681",
  appId: "1:314059861681:web:3ecd93111648c79038bc90"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─── Default Student Data (all 147) ──────────────────────────────────────────
const DEFAULT_STUDENTS = [
  { name: "AGBOR DIDIER AYUK-NTUI", id: "LMUI2637007", dept: "SOFTWARE ENGINEERING", github: "https://github.com/agbordidier610-dev/-MAD400-LMUI2637007-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Bambe Tyler-praise Nfaih", id: "LMUI250719", dept: "SWE", github: "https://github.com/BambeTyler/MAD400-LMUI250719-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "ASONGSEH QUEENTIN A", id: "LMUI250706", dept: "SWE", github: "https://github.com/Sarkodie3/MAD400--YourStudentID--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "Repo still contains 'YourStudentID' placeholder!" }] },
  { name: "Epie Kajeta Nzeh", id: "LMUI250784", dept: "Computer Engineering (SWE)", github: "https://github.com/EpiekajetaNzeh/MAD400-LMUI250874-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo uses LMUI250874 but form says LMUI250784 — digits swapped" }] },
  { name: "NJI DURELL", id: "LMUI250908", dept: "SOFTWARE ENGINEERING", github: "[BROKEN: MAD400-LMUI250908-TaskManager — no username]", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "GitHub URL appears broken — no username in URL" }] },
  { name: "FUAFUELAKA MOSCO", id: "LMUI25SWE0817", dept: "COMPUTER ENGINEERING", github: "https://github.com/FUAFUELAKAMOSCO/MAD400-25SWE0817-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Eboule Cedric Julien", id: "LMUI250762", dept: "Software Engineering", github: "https://github.com/Cjayy77/-MAD400-LMUI250762-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "QUEEN CLAIRE BATO MAYA KWO", id: "LMUI250938", dept: "SOFTWARE ENGINEERING", github: "https://github.com/queenclairemaya/MAD400-LMUI250938-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Ngulefeh Ashley Nkengawung", id: "LMUI250900", dept: "Software", github: "https://github.com/Ashley237/taskmanager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo not named per required format (no MAD400-StudentID)" }] },
  { name: "Biki God's will", id: "LMUI24SWE286", dept: "Software Engineering", github: "https://github.com/BikiGodswill/MAD400-LMUI24SWE286-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Samuel motomby", id: "LMUI250943", dept: "Software Engineering", github: "https://github.com/Motomby/MAD4000-task-manager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo named 'MAD4000' (extra zero typo)" }] },
  { name: "Sakwe Joris Eboka", id: "LMUI2637011", dept: "SOFTWARE ENGINEERING", github: "https://github.com/sakwejoris1/LMUI2637011-TaskManager/", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "EFUETMETSETENDONGAFACDAVID", id: "LMUI250772", dept: "Software Engineering", github: "https://github.com/Efuet-David/AD400-LMUI250772-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo named 'AD400' not 'MAD400'" }] },
  { name: "KIMBI BLESS TANGIRI", id: "LMUI250829", dept: "Software Engineering", github: "https://github.com/Blesskimbi/MAD400---LMUI250829---TASKMANAGER", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Nkengfua Caleb Nkengafac", id: "LMUI-24SWE296", dept: "Software Engineering", github: "https://github.com/nkengfuacaleb237/MAD400-LMUI-24SWE296-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Lacmago Magniapi Rebecca", id: "LMUI2637005", dept: "Software Engineering", github: "https://github.com/LACMAGO05/MAD400-LMUI2637005-TaskManager/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Bah Dieudonne Simbo Nanah", id: "LMUI250715", dept: "Software Engineering", github: "https://github.com/BahDieudonne/LMUI250715-TaskManagementApp.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "ZIPOH CHELSEA NJEUPIEN", id: "LMUI0987", dept: "SOFTWARE ENGINEERING", github: "https://github.com/ZIPOH/MAD400-LMUI250987-TaskManager1.git", recording: "[INVALID: wrote 'Okay sir']", collab: "Yes", files: "9+", flags: [{ type: "critical", msg: "No screen recording submitted — wrote 'Okay sir'" }] },
  { name: "RODRIQUE PIXIE TSOPMOH", id: "LMUI250939", dept: "Software Engineering", github: "https://github.com/RodPix/MAD400-LMUI250939-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Ndunji Fabrice Biyeh", id: "LMUI250882", dept: "SWE", github: "https://github.com/ndunjifabrice919-wq/MAD400-LMUI250882-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Ngo Baone Essoubat Marilyne Vera", id: "LMUI250893", dept: "Software Engineering", github: "https://github.com/NgoBaone/MAD400-LMUI250893-TaskManager.git", recording: "[INVALID: docs.google.com/videos link]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "Recording link is invalid (docs.google.com/videos format)" }] },
  { name: "NFOR RANDOF FANYU", id: "LMUI250887", dept: "SWE", github: "https://github.com/RANDOF483/MAD400--LMUI250887--Taskmanager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Divine Chinecherem Nnamdi", id: "LMUI-24SWE287", dept: "Software Engineering", github: "https://github.com/Mck-Dior/MAD400-LMUI24SWE287-TaskManager.git", recording: "[INVALID: submitted GitHub link instead of video]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "Recording field has GitHub repo link, not a video" }] },
  { name: "Efenzia Fuafuelak Romanus", id: "LMUI260770", dept: "Software Engineering", github: "https://github.com/Tech-Roman/MAD400-LMUI260770-TASKMANAGER", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "FUNWI CHELSEA NCHANGNWI", id: "LMUI24SWE291", dept: "Software Engineering", github: "https://github.com/FunwiChelsea/-MAD400FunwiChelseaNchangnwiTaskManager.git", recording: "https://drive.google.com/file/view", collab: "No", files: "6–8", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "WAINKEM BISMARK MBZINGEH", id: "LMUI250978", dept: "Software Engineering", github: "https://github.com/Bismark490/Bismark490-MAD400-LMUI250978-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "BESINA SONIA KUSONA", id: "LMUI250724", dept: "Software Engineering", github: "https://github.com/BESINA-star/LMUI250724-TaskManagerApp.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "AWEDEMO TESITA KUMBO", id: "LMUI250708", dept: "SOFTWARE ENGINEERING", github: "https://github.com/AwedemoTesitakumbo/MAD400-LMUI250708-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "NDUM SAMUEL AMBANASOM", id: "LMUI250881", dept: "SOFTWARE ENGINEERING", github: "https://github.com/ambanasom/MAD400--LMUI250881--TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Tikum Herickson fon", id: "LMUI250976", dept: "Software Engineering", github: "https://github.com/TIKUM-HERICSON-FON/MAD400-LMUI250976-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Fon Daniel Tsay Nana", id: "LMUI250804", dept: "SWE", github: "https://github.com/Fon-Daniel-Tsay-Nana/MAD400--LMUI250804--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Aishatou Ali", id: "LNUI250698", dept: "Computer Engineering", github: "https://github.com/Aishatouali/MAD400-lmui250698-Task_Manager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Student ID starts with LNUI not LMUI — verify" }] },
  { name: "Tchomakam Ange Cabrel", id: "LMUI250967", dept: "Software Engineering", github: "https://github.com/Ange-Boyz/MAD400-LMUI250967-Task_Manager_App", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Nana Fabu Kongla Disue", id: "LMUI250871", dept: "Software Engineering", github: "https://github.com/Engr-Nana-Fabu/MAD400-LMUI250871-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "No", files: "6–8", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "SABOH STANROBORN", id: "LMUI250940", dept: "Software Engineering", github: "https://github.com/saboh-stanley/MAD400-LMUI250940-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "NDIMBE DARLYNTON ANGWANG", id: "LMUI250877", dept: "Software Engineering", github: "https://github.com/Ndimbe15/MAD400-LMUI250877-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Ngoe Zelda Anagfac", id: "LMUI250896", dept: "Software Engineering", github: "https://github.com/zeldatek/MAD400--LMU1250896--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Mokube Dirian Okole", id: "LMUI-250864", dept: "Software Engineering", github: "https://github.com/diriansparck/MAD400-LMUI250864-TaskManager/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "AWAH TAMBAN BLAISE", id: "LMUI-24SWE282", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Awah-Blaise/MAD400-LMUI24SWE282-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "SONA KOLLE MARLYSE", id: "LMUI250946", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Kandy-541/-MAD400-LMUI250946-TaskManagers.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "NOFONDO EPITE FRANCIS", id: "LMUI250920", dept: "SWE", github: "[BROKEN: https://github.com/NOFONDO) — closing parenthesis, no repo]", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "GitHub URL is broken (has closing parenthesis, no repo name)" }] },
  { name: "YOH PRECIOUS ENONGENE", id: "LMUI250985", dept: "SWE", github: "https://github.com/Yohprecious/MAD400-YOHLMUI250985-Taskmanager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Achankeng Sylvia Kenu", id: "LMUI-24SWE281", dept: "Software Engineering", github: "https://github.com/Achanken/MAD400-LMUI-24SWE281-TaskManager", recording: "[INVALID: gdrive.google.com/drive/home — points to Drive home not video]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "Recording link points to Google Drive home, not a video" }] },
  { name: "Asonganyi Maxwell Akanju", id: "LMUI250704", dept: "Software Engineering", github: "https://github.com/Asonganyimaxwellakanju/MAD400-LMUI250704-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "AKEM DESMOND MEMBO", id: "LMUI250680", dept: "SOFTWARE ENGINEERING", github: "https://github.com/AKEMDESMONDMEMBO/MAD400-LMUI250680-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Jasmine Gael", id: "LMUI250825", dept: "SWE", github: "https://github.com/mbeughehgael-sudo/LMUI250825-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "Omerine Bunginy Egbe Yembe", id: "LMUI250931", dept: "Computer Engineering - SWE", github: "https://github.com/OmerineEgbe/MAD400-LMUI250931-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "AJOCHA PRECIOUS TAJOCHA", id: "LMUI250677", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Ajocha/MAD400-LMUI250677-TASK-MANAGER.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "ID LMUI250677 also claimed by 'Ambe precious Neba' — INVESTIGATE" }] },
  { name: "Tayu Didier Shalanyuy", id: "LMUI250964", dept: "SWE", github: "https://github.com/TayuDidier/MAD400-LMUI250964-TaskManager/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "BABILA IVY-ROSE", id: "LMUI250714", dept: "Software Engineering", github: "https://github.com/IvyRoseTech/MAD400--LMUI250714--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Wanyu Blaise", id: "LMUI-24SWE299", dept: "Software Engineering", github: "https://github.com/wanyu777/AD400-LMUI-24SWE299-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo named 'AD400' not 'MAD400'" }] },
  { name: "Monie Serene Njilah", id: "LMUI250865", dept: "Software Engineering", github: "https://github.com/237monie/MAD400-LMUI250865-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "WERIWOH NAOMI ABONG", id: "LMUI2637006", dept: "SOFTWARE ENGINEERING", github: "https://github.com/WeriwohNaomi/LMUI2637006-TaskManager/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "NAI FAITH NJANG", id: "LMUI2646929", dept: "Software Engineering", github: "https://github.com/njangnai-jpg/MAD400-LMUI2646929-TaskManager/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Nformi James Nganyu", id: "LMUI250888", dept: "Software Engineering", github: "https://github.com/Nf0rmijim/MAD400-LMUI250888-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Chi John Brown Asanji", id: "LMUI250747", dept: "Software Engineering", github: "https://github.com/JohnBrown67787/MAD400-LMUI250747-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "NFOR-TABI ELAD LIUGGY", id: "LMUI-24SWE295", dept: "Software Engineering", github: "https://github.com/EladLiuggy/MAD400-LMUI-24SWE295-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "SEIGNEU TSAMO KAMILE NATHAN", id: "LMUI250944", dept: "Software Engineering", github: "https://github.com/kamile1010/MAD400-LMUI250944-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Maximinus Mboni feh", id: "LMUI250845", dept: "SWE", github: "https://github.com/12MAXIMINUS3/LMUI250845/tree/master", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "ID LMUI250845 also claimed by 'MBONGWOH ULRICH' — INVESTIGATE" }] },
  { name: "Ebua Treasure Bright", id: "LMUI25SWE087", dept: "Software Engineering", github: "https://github.com/ebuatreasure-afk/MAD400-LMUI25SWE087-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Ineube Kemmerick Ibanjoh", id: "LMUI24SWE293", dept: "SOFTWARE ENGINEERING", github: "https://github.com/ibanjohKem/IneubeKemmerickIbanjoh-MAD400-LMUI24SWE293-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "No", files: "6–8", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "USMANO ALI", id: "LMUI250977", dept: "Software Engineering", github: "https://github.com/usmanouA/MAD400-LMUI250977-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "ONYINYECHI MIRACLE NWOGU", id: "LMUI250932", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Onyinyechi-miracle-nwogu/MAD400-LMUI250932-TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "NJI UBRYNE FRU", id: "LMUI250910", dept: "Software Engineering (SWE)", github: "https://github.com/NjiUbryne04/SWE--LMUI250910--TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Preston Njakoy Shey", id: "LMUI2636894", dept: "Software Engineering", github: "https://github.com/preston-solo/MAD400-LMAI2636894-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Ntah Alvin Tafah", id: "LMUI250922", dept: "Software Engineering", github: "https://github.com/Eng-Alvin/MAD400--LMUI240922--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "No", files: "6–8", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "Akonwie Angel Tawe", id: "LMUI250682", dept: "Software Engineering", github: "https://github.com/angeltawe/MAD400-LMUI250682-taskmanager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Nnoubisi Glorymercy", id: "LMUI250918", dept: "Software Engineering", github: "https://github.com/GLORY-MERCY/MAD400--LMUI250918--TaskManager.git", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "CHESAMI PRECIOUS FRI", id: "LMUI250745", dept: "Software Engineering", github: "https://github.com/precious-fri/MAD400-LMUI250745-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "ATABONGFAC RODELLE STEPHANIE", id: "LMUI250707", dept: "SOFTWARE ENGINEERING", github: "https://github.com/nkengbejangcolette-cmd/MAD400-LMUI250707-TaskManager", recording: "https://drive.google.com/file/view", collab: "Yes", files: "5", flags: [] },
  { name: "Achua Ekkeh Favour Tabitha", id: "LMUI250669", dept: "Software Engineering", github: "https://github.com/AchuaFavour/LMUI250669-TaskManager#", recording: "https://drive.google.com/file/d/1pgyaTTbkf0e83LbXwTh5x4tFwIW0lwWO/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix; submitted 2 recording links" }] },
  { name: "mbekek perianne", id: "LMUI250847", dept: "Software Engineering", github: "https://github.com/MBEKEKperiane/MAD400--LMUI250847--TaskManager", recording: "https://drive.google.com/file/d/1yAQu2sToldVTfrE7r7A2j7UL83wJQDk6/view", collab: "Yes", files: "5", flags: [] },
  { name: "Sumenjabe Ramiel", id: "LMUI250949", dept: "Software Engineering", github: "https://github.com/sumenjabe/MAD400-LMUI250949-taskManager.git", recording: "https://drive.google.com/file/d/1-Cd9kUGQ-sxgM59UoYs4WBZiQhTBQkjm/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Stephen Mbenda", id: "LMUI250947", dept: "Software Engineering", github: "https://github.com/stephenmbenda/MAD400-LMUI250947-TaskManager", recording: "https://drive.google.com/file/d/1oqRNA43Kcw4x3xXZvTOG6-2jQJ_npm_K/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "MOKOLONO PROSPER MOLUI", id: "LMUI250863", dept: "Software Engineering", github: "https://github.com/mokolonoprosper/MAD400-LMUI250863-TaskManager", recording: "https://drive.google.com/drive/folders/124ULBQNXN7DWTdh8pfq-6V05Hup8IPeR", collab: "Yes", files: "5", flags: [] },
  { name: "Njabe Edwin Ndape", id: "LMUI250903", dept: "SWE", github: "https://github.com/Pasino675/MAD400-LMUI250903-TaskManager.git", recording: "https://drive.google.com/file/d/16QM5V8HnSnN0CEhO9ON4ellcopcZ_tb0/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Fonya Elio Ndemaze", id: "LMUI250809", dept: "SWE", github: "https://github.com/fonyaNdemaze9/MAD400-LMUI250809-TaskManager.git", recording: "https://drive.google.com/file/d/1jSKYwoJyXsqW-iZdmFpPnbdswCRJ2LxR/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "KENCHI ANKELMBOM FONYUY", id: "LMUI250827", dept: "Software Engineering", github: "https://github.com/fonyuysamuel57/MAD400-LMUI250827", recording: "https://drive.google.com/drive/folders/1GnPeEe-bYR2mFsaufY3DaoF5CkW_Djw5", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Student ID entered as LUMI250827 (typo: missing N)" }] },
  { name: "MBONGWOH ULRICH", id: "LMUI250845B", dept: "SWE", github: "https://github.com/ulrichmbongwoh-code/MAD400--LMUI250854--TaskManager", recording: "https://drive.google.com/file/d/1tV6j1OEUxsGBXq1_WCwWbL6r01_PT6aA/view", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "ID LMUI250845 also claimed by 'Maximinus Mboni feh' — INVESTIGATE" }] },
  { name: "Tata Mordepet Mbuta", id: "LMUI250963", dept: "Software Engineering (Top up)", github: "https://github.com/WELLSDURk/MAD400-LMUI250963-TaskManager", recording: "https://drive.google.com/file/d/1fVlvFBhTFiYzCPYNGPqYHqQswnlDoQg8/view", collab: "Yes", files: "5", flags: [] },
  { name: "Fuangume Princewill Ndoye", id: "LMUI250818", dept: "Software Engineering", github: "https://github.com/sirdee815-droid/MAD400LMUI250818-TaskManger-", recording: "https://drive.google.com/file/d/1kNCxmX9bi4XMG1XMwdNuLk79LK0I46oy/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Ebua Faith-Donald", id: "LMUI250763", dept: "SWE", github: "https://github.com/Thbeginning/MAD400-LMUI250763-TaskManager.git", recording: "https://drive.google.com/file/d/1sJ-1HhVtjRruVvZPcXxuVqOBVC7ppP8Y/view", collab: "No", files: "5", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "Egbe Burnley Bachange", id: "LMUI250774", dept: "SWE", github: "https://github.com/egbeburnley77-create/MAD400-LMUI250774-TaskManager", recording: "https://drive.google.com/file/d/1Z95ezRgVEZHKAwWPBLBbRDIeIa49Cvha/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Foreke Bellah Moritz Asongtia", id: "LMUI250811", dept: "Software Engineering", github: "https://github.com/Foreke-moritz/MAD400-LMUI250811-TaskManager.git", recording: "https://drive.google.com/file/d/14NDtG9eIhDDK5RP6Wl0wo7UbzjWfOQcR/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "OPEH SANDRINE MAAGBOR", id: "LMU24SWE297", dept: "Software Engineering", github: "https://github.com/Agbor-Sandrine/MAD400-LMUI24SWE297-TASKMANAGER.git", recording: "https://drive.google.com/file/d/1zqLFappmURsJBwioT4h6-hy-HPD-XY0e/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "dang medjo harel", id: "LMUI250750", dept: "SWE", github: "https://github.com/harelmedjo/MAD400--LMUI250750--TaskManager.git", recording: "https://drive.google.com/file/d/1kUYcOgXL99Q-X_5crP_k5aV9d1iQEmTB/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Kum Marcundy Bame", id: "LMUI250833", dept: "Software Engineering", github: "https://github.com/KumMarcundyBame/MAD400--LMUI-250833--TaskManager", recording: "https://drive.google.com/file/d/1FG9beP-EHfg3Dxdfr-DYwbaAXigiQ21A/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "EGAIMBI UPWARD", id: "LMUI1250773", dept: "Software Engineering", github: "https://github.com/egaimbiupward/MAD400--LMUI1250773--TaskManager", recording: "https://drive.google.com/file/d/1Wh-fhiktJrUluwWITvFXUG1CVpOKWyrL/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "MARK MUKEFOR DOHBIT", id: "LMUI250759", dept: "SWE", github: "https://github.com/MarkDohbit/MAD400-LMU-25SWE0759-TaskManager", recording: "[MISSING: blank submission]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "No screen recording submitted" }] },
  { name: "ANTEM PADRE-PIO AJONGISON", id: "LMUI250694", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Antem-Pandre/MAD400-LMUI250694-TaskManager.git", recording: "https://drive.google.com/file/d/1vqqWBzxwzlq9rLI2zesnqrKnWs0DE5gv/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Ngala Hope Gikeh", id: "LMUI250890", dept: "SWE", github: "https://github.com/BrandyPearl/LMUI250890TaskManager", recording: "https://drive.google.com/file/d/1eEKdYEpVhxhPXhQdWI6guWrI5EKGZRMe/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "Ndikum Arnold Dibo Anyu", id: "LMUI250876", dept: "Software Engineering", github: "https://github.com/Unique-MrSchwarz/MAD400-LMUI250876-TaskManager", recording: "https://drive.google.com/file/d/1w8vsUA5eFR_llGBLm9CJXLFBXe-0QhbT/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Ambe precious Neba", id: "LMUI250677B", dept: "SWE", github: "https://github.com/ambeprecious24-star/MAD400-LMUI250677-TAaskManager.git", recording: "https://drive.google.com/file/d/1Lz3Vr020IJNUG7drR9U4i8cE-ugTjZ2B/view", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "ID LMUI250677 also claimed by 'AJOCHA PRECIOUS TAJOCHA' — INVESTIGATE" }] },
  { name: "Ngoe Gaiel Maloba", id: "LMUI250894", dept: "Software Engineering", github: "https://github.com/MalobaGaiel200/MAD400-LMUI250894-TaskManager", recording: "https://drive.google.com/file/d/1goCvEvAtEdTiYKx6mBy2NaXVrmClfsjB/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "BEMAIH KELLY BERANGERI", id: "LMUI250722", dept: "Software Engineering", github: "https://github.com/BEMAIH-KELLY/MAD400-LMUI250722-TaskManager.git", recording: "https://drive.google.com/file/d/1fsCYtdx4ElP0NsuIbQNq8L86VVhRuaui/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "TAH DAMARIS AMBANG", id: "LMUI250953", dept: "SWE", github: "https://github.com/Tah-Dam/MAD400-LMUI250953-TaskManager", recording: "https://drive.google.com/file/d/1d86nQuxfdOg2a717rotksh8ANESU4ENr/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "ENOW ERIC WERNER", id: "LMUI250781", dept: "Software Engineering", github: "[BROKEN: enow-eric-werner/MAD400-LMUI250781-TaskManager/github.com]", recording: "https://drive.google.com/file/d/1CvWpE8qMB0NFM9SsQIT39eiX4FdaDOLw/view", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "GitHub URL is completely malformed (not a valid URL)" }] },
  { name: "Etchu Culbertson enow mbeng", id: "LMUI250790", dept: "Software Engineering", github: "https://github.com/etchu237/MAD400--LMUI250790--TaskManager.git", recording: "https://youtube.com/shorts/2iLPalWXUPo", collab: "Yes", files: "5", flags: [] },
  { name: "Akere Emile Nji", id: "LMUI250681", dept: "Software Engineering", github: "https://github.com/Rimuru236/MAD400--LMUI250681--TaskManager.git", recording: "https://drive.google.com/file/d/1CVCmy51AtAiTVBcEhv2Ne-3ihI_nG-Hh/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Nuke Amina Teke", id: "LMUI250926", dept: "Software Engineering", github: "https://github.com/Aminateke/MAD400-LMUI250926-TaskManager", recording: "[MISSING: blank submission]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "No screen recording submitted" }] },
  { name: "Efeme Royal", id: "LMUI24-SWE288", dept: "Software Engineering", github: "https://github.com/efemeroyal/MAD400-LMUI24SWE288-TaskManager", recording: "https://drive.google.com/file/d/1a5sckH4w3tMuKV-I5ClyrFFdf8XAKUyV/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "DJEMENI TEPIE DENTEP", id: "LMUI250757", dept: "Software Engineering", github: "https://github.com/djiemenitepie/MAD400-LMUI250757-TaskManager", recording: "https://drive.google.com/file/d/1A3JjnhqKA9h6fOPqvYUahdUXfdpxOu3-/view", collab: "No", files: "5", flags: [{ type: "warn", msg: "Lecturer NOT added as collaborator" }] },
  { name: "Fongang Kamte Amex Durand", id: "LMUI250807", dept: "Software Engineering", github: "https://github.com/kamtedurand-afk/MAD400-LMUI250807-TaskManager.git", recording: "https://drive.google.com/file/d/1vtj3B5o3Gukw3aLx5fIkfHf9SRxWEazZ/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Student ID entered as LMUI205807 (digits transposed)" }] },
  { name: "AWONGU AGABI THERESE-CLAIRE", id: "LMUI250709", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Therese-Claire/MAD400-LMUI250709-TaskManager", recording: "https://drive.google.com/file/d/1Utxy99M_zCff-Tnv7OFMSltuyy1WpdRh/view", collab: "Yes", files: "5", flags: [] },
  { name: "Ndum Fang Tracy Zu'tekeze", id: "LMUI250880", dept: "Software Engineering", github: "https://github.com/tracyriele25/MAD400-LMUI250880-TaskManager.git", recording: "https://drive.google.com/file/d/14xlvpsMT7fysxffIVu5WczUYYoVeI0ik/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo URL ends in '.gi' (missing 't') — verify link works" }] },
  { name: "Hephzibah Malet Kwede", id: "LMU24-SWE292", dept: "Engineering and Technology", github: "https://github.com/DMK35/MAD400-LMUI24-SWE292-TaskManager", recording: "https://youtu.be/VTg1po_pYms", collab: "Yes", files: "5", flags: [] },
  { name: "Brandon Fonyuy Kome", id: "LMUI250733", dept: "Software Engineering", github: "https://github.com/brandonkjr485-glitch/MAD400-LMUI250733-TaskManager.git", recording: "[INVALID: broken Drive folder link]", collab: "Yes", files: "9+", flags: [{ type: "warn", msg: "Recording link appears broken" }] },
  { name: "FATIME RACHEL ADELAIDE", id: "LMUI-24SWE290", dept: "Software Engineering", github: "[BROKEN: missing slash — https://github.comFATIMERachel15/...]", recording: "[INVALID: docs.google.com/videos link]", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "GitHub URL broken (missing slash after .com)" }, { type: "critical", msg: "Recording link invalid (docs.google.com/videos)" }] },
  { name: "Stephen Ngulle Njoh", id: "LMUI250948", dept: "Software Engineering", github: "https://github.com/stevo44/MAD400-LMUI250948-TaskManager.git", recording: "https://drive.google.com/file/d/1rol3j7oat1tqvY9Dww37NMemSsXD0be8/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Kiney Lauren Egbe K.", id: "LMUI250830", dept: "Software Engineering", github: "https://github.com/laurenkiney19-cell/-MAD400-LMUI250830-TaskManagementApp.git", recording: "https://drive.google.com/file/d/1Ed1kd1_ZUjW5P75Z0b-pxJuWcGbRn4b-/view", collab: "Yes", files: "5", flags: [] },
  { name: "BRENDA MANDETA NOFANJO", id: "LMUI250734", dept: "Software Engineering", github: "https://github.com/808Brenda/MAD400-LMUI250734-TaskManager", recording: "https://drive.google.com/file/d/1IO0vXDhGNJJ39cfLkKs8Lu9_EKXNn9CU/view", collab: "Yes", files: "5", flags: [] },
  { name: "AKANA BURNLEY FONGANG", id: "LMUI250679", dept: "SOFTWARE ENGINEERING", github: "https://github.com/Burn34-arch/MAD400---LMUI250679---TaskManager", recording: "https://drive.google.com/file/d/1dnvJ7r3RCuQ3xY3UjwWN4Cd_4Vugh_Lu/view", collab: "Yes", files: "5", flags: [] },
  { name: "ANGWI CIARA FOMUNUNG", id: "LMUI250690", dept: "Software Engineering", github: "https://github.com/Ciara237/MAD400-LMUI250690-TaskManager", recording: "https://drive.google.com/file/d/11Ik61LVhLu0OyjcZtbmI2sn6SyAs_W5i/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Besingi Marinus Nyando", id: "LMUI-24SWE285", dept: "Software Engineering", github: "https://github.com/BESINGI-MARINUS/MAD400-LMUI-24SWE285-TaskManager", recording: "https://www.loom.com/share/308d987d2d63408b9911e14d45061f0e", collab: "Yes", files: "6–8", flags: [] },
  { name: "ENYENGE LIFONGO TRACYMA QUEEN", id: "LMUI263695", dept: "Software Engineering", github: "https://github.com/lifongotracy/MAD400-LMUI263695-TaskManager", recording: "[INVALID: gdrive mobile link]", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Recording is Google Drive mobile (no direct link — verify accessible)" }] },
  { name: "TEKANG MERILINE NGWECK", id: "LMUI250970", dept: "SOFTWARE ENGINEERING", github: "https://github.com/TEKANMERILINE1/MAD400--LMUI250970--TaskManager", recording: "https://drive.google.com/file/d/1ZEwWWH0opKsWPKbHi6AB-Hk_p10fVNDm/view", collab: "Yes", files: "5", flags: [] },
  { name: "Sakwe Sharon Bake", id: "LMUI250942", dept: "Software Engineering", github: "https://github.com/Sharondiv/MAD400-LMUI250942-TaskManager", recording: "https://drive.google.com/file/d/1wl4mUVEXSiwpxsGzlZQfmV_18pLRjuGU/view", collab: "Yes", files: "9+", flags: [] },
  { name: "KUM PROSPER NJI", id: "LMUI2636996", dept: "Software Engineering", github: "https://github.com/Nji2003/MAD400--LMUI2636996--TaskManager", recording: "https://drive.google.com/file/d/146W32wH6YO1dGztrNyFgkdkWgE2hYWfZ/view", collab: "Yes", files: "5", flags: [] },
  { name: "Nkonganyi Blec Ketu", id: "LMUI250915", dept: "Software Engineering", github: "https://github.com/Nkonganyi/MAD400-SWE250915-TaskManager", recording: "https://drive.google.com/file/d/1HfKMc9bjDt-b0zlfjoeGzRYupMgX-TDi/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Nebasten Echu Tanga", id: "LMUI250886", dept: "Software Engineering", github: "https://github.com/Nebasten/MAD400-LMUI250886-TaskManagers", recording: "https://drive.google.com/file/d/1trLoEbsCdGThewf11ymRO-u2fLT2OZDa/view", collab: "Yes", files: "5", flags: [] },
  { name: "TAMBE AWUH BRIDGETTE", id: "LMUI250958", dept: "SOFTWARE ENGINEERING", github: "https://github.com/BridgetteTambe/Task_manager_app", recording: "https://drive.google.com/file/d/1XkHaBCKZKK84nzVZdhQcKbwtevEw6dyg/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo not named per required format (no MAD400-StudentID)" }] },
  { name: "BONGYEN STEPHY CROSS", id: "LMUI250731", dept: "SOFTWARE ENGINEERING", github: "https://github.com/stephycross/MAD400-LMUI25073-TaskManager", recording: "https://drive.google.com/file/d/1MC2IyltodrNYeO5D3aHmOmK3744BFAsR/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo uses LMUI25073 (missing last digit of ID LMUI250731)" }] },
  { name: "Ebot Elisabeth Bessem", id: "LMUI250761", dept: "SWE", github: "https://github.com/EbotElisabeth/MAD-LMUI250761-TaskManager", recording: "https://drive.google.com/file/d/1ZN4j8Q1slSqwHsUmRdnu24lfo2k-8RhM/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo named 'MAD' not 'MAD400'" }] },
  { name: "Nguefack Anang Chinnada", id: "LMUI250899", dept: "Software Engineering", github: "https://github.com/nguefackanang7-hue/LMUI250899-TaskManager", recording: "https://drive.google.com/file/d/1BaGbpRE683rO9rt0u4aEqhB3vVMxM15a/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "NDAH MUNANG MICHEAL", id: "LMUI250872", dept: "Software Engineering", github: "https://github.com/mikeTech123/AD400--LMUI250872--TaskManager.git", recording: "https://drive.google.com/file/d/1j3z-AemKfJIWGwL6HBWAJmJ-RAj3VKcZ/view", collab: "Yes", files: "5", flags: [{ type: "warn", msg: "Repo named 'AD400' not 'MAD400'" }] },
  { name: "EBUBE DIVINE CHRIS OBI", id: "LMUI250766", dept: "Software Engineering", github: "https://github.com/ebube99/LMUI250766-TaskManager.git", recording: "https://drive.google.com/file/d/1-cqWrArZN0C3C5cRmMMphyKxuEFbvHw4/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "Fang Vanessa Egbe", id: "LMU25SWE0800", dept: "Software Engineering", github: "https://github.com/Vanessaegbe/task-management-app.git", recording: "https://drive.google.com/file/d/1WB-jAodthPpXC2Zl7OuE5yXNOGB8-s7-/view", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo not named per required format" }] },
  { name: "Wowai Mark Ngombiga", id: "LMUI250981", dept: "Software Engineering", github: "https://github.com/Wowai-Mark/MAD400-LMUI0981-TaskManager.git", recording: "https://drive.google.com/file/d/1-LN1Ya1XlUPYm3oJ1yy1oWupc_puA3CB/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Esong Blessing", id: "LMUI250789", dept: "Software Engineering", github: "https://github.com/esongblessingseboh-sassy/LMUI250789-TaskManager/tree/main/taskapp", recording: "https://drive.google.com/drive/folders/1yO-iAP5jMRVlr0R9Y8uO4Lw14hCzVAtR", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Repo missing 'MAD400' prefix" }] },
  { name: "ASEH VICTORY ANDONGWEI", id: "LMUI2637001", dept: "Software Engineering", github: "https://github.com/Victoryaseh/MAD400-LMUI2637001-taskmanager", recording: "https://drive.google.com/file/d/1eNe3W-WZE7lcfCMWcFejCPLiEUyYeA3f/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Dimordi Bosse Lucrece", id: "LMUI250754", dept: "Software Engineering", github: "https://github.com/Lucrece20/MAD400-LMUI250754-TaskManager", recording: "https://drive.google.com/file/d/1amgCgcnLnihNXPsTE0nn0L2w0cSsINOo/view", collab: "Yes", files: "9+", flags: [] },
  { name: "AKA THOMAS NTIWETABONG", id: "LMUI250678", dept: "SWE", github: "https://github.com/nkuitabongdestiny-wq/MAD400-LMUI250678-TaskManager", recording: "https://drive.google.com/file/d/1SvcPGdzyxHS180A7nRm7ZI7Kl86eoe1w/view", collab: "Yes", files: "5", flags: [] },
  { name: "Tambong Fidelis Junior", id: "LMUI250962", dept: "Software Engineering", github: "https://github.com/tambongjunior/MAD400-LMUI250962", recording: "https://drive.google.com/file/d/1mgKe9BJMvUe5a-8z2yAayEfbiBjR_4z_/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Njeck Favour Lyviette", id: "LMU250905", dept: "Software Engineering", github: "https://github.com/njeckfavour84-cloud/Task-manager-assignment.git", recording: "[INVALID: typo in Drive link 'virw' instead of 'view']", collab: "Yes", files: "6–8", flags: [{ type: "warn", msg: "Recording link has typo ('virw' instead of 'view') — verify" }] },
  { name: "NKEMBENI DABRAT BONYEKI", id: "LMUI250913", dept: "SOFTWARE ENGINEERING", github: "https://github.com/nkembenidabrat4-star/MAD400-LMUI250913-TaskManager", recording: "https://drive.google.com/file/d/1M_Bt__oZkDTy1V155T0aXyJNSrnUR1yz/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Babila Godlove Bless Tafry", id: "LMUI24SWE284", dept: "Software Engineering", github: "https://github.com/cedricngongeh92-tech/MAD400-Babila_Godlove-TaskManager", recording: "https://drive.google.com/file/d/1rwy_SjL7Zc17fF5HhTuZqDGR1sYTnV0K/view", collab: "Yes", files: "9+", flags: [] },
  { name: "Lois-Ann Mojoko", id: "LMUI250841", dept: "Software Engineering", github: "https://github.com/Mojoko123/MAD400-SWE20250841-TaskManager", recording: "https://drive.google.com/file/d/15ECXr24PXsk8VYA70kzmSdz3ludKTRyA/view", collab: "Yes", files: "5", flags: [] },
  { name: "Fru Bless Azuah-Nwi", id: "LMUI250815", dept: "Software Engineering", github: "https://github.com/Bless42/MAD400-LMUI250815-TaskManager", recording: "https://drive.google.com/file/d/1ClAf6MhDhUApbyqpfAOZCV7gXSFo5Ylt/view", collab: "Yes", files: "9+", flags: [] },
  { name: "Lifoter Prosper", id: "LMUI2637020", dept: "Software Engineering", github: "https://github.com/betaprosper/MAD400-LMUI2637020---TaskMananger", recording: "https://drive.google.com/file/d/17chMiP7ve0f1VRU0UDsg6_zJAzQc-RtD/view", collab: "Yes", files: "9+", flags: [] },
  { name: "Chenwi kelly", id: "LMUI250744", dept: "Software Engineering", github: "https://github.com/chenwikelly11-dot/MAD400-21SW250744", recording: "[INVALID: wrote 'Heve']", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "No screen recording submitted" }] },
  { name: "Tezock Tekoh Russel", id: "LMUI250973", dept: "SWE", github: "http://github.com/russeltezock/MAD400--LMUI250973--TaskManager", recording: "https://drive.google.com/file/d/1jpaPB1FkQY1XIhiA1GyRu_abydf36pRF/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "NDAM PRECIOUS MBANWEI", id: "LMUI250873", dept: "Software Engineering", github: "https://github.com/ndam1-Tech/MAD400-LMUI250873-TaskManager", recording: "https://drive.google.com/file/d/1qf9afwxURQ-x6JyL89S3eXfBfqpFvIUf/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "NFOR NGONGYITEH BIKUSINYU", id: "LMUI24SWE294", dept: "Software Engineering", github: "https://github.com/NFOR-NGONGYITEH/MAD400-LMUI24SWE294-TaskManager.git", recording: "[INVALID: submitted '..']", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "No screen recording submitted" }] },
  { name: "OTTOP SCOTT BISONG", id: "LMUI230934", dept: "Software Engineering", github: "https://github.com/Bscott07/MAD400-LMUI250934---MATERIALAPP.git", recording: "[MISSING: None submitted]", collab: "Yes", files: "6–8", flags: [{ type: "critical", msg: "No screen recording submitted" }, { type: "warn", msg: "Repo named 'MATERIALAPP' not 'TaskManager'" }] },
  { name: "Ebot Clarisse Awanga", id: "LMUI250760", dept: "Software Engineering", github: "https://github.com/ebot-clarisse/MAD400-LMUI250760-TaskManager", recording: "https://drive.google.com/file/d/1OpzleXE-kPSbJOLvP81zZsVZDh_e8PoL/view", collab: "Yes", files: "6–8", flags: [] },
  { name: "Chungag Tala Ngum", id: "LMUI250748", dept: "Software Engineering", github: "https://github.com/ChungagTala/MAD400-LMUI250748-TaskManagerApp.git", recording: "https://1drv.ms/v/c/73f3b4045753047a/IQ...", collab: "Yes", files: "5", flags: [] },
  { name: "Mbota Princewill Nanje", id: "LMUI250855", dept: "Software Engineering", github: "https://github.com/Mbotaprincewill/MAD400--LMUI250855--TaskManager", recording: "[INVALID: 'I was caught by time']", collab: "Yes", files: "5", flags: [{ type: "critical", msg: "No screen recording submitted — wrote 'I was caught by time'" }] },
];

const LECTURER_PASSWORD = "MAD400@Atumkeze2026";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcTotal = (g) => {
  if (!g) return null;
  const vals = [g.s1, g.s2, g.s3, g.s4, g.s5].map(x =>
    x === "" || x === undefined || x === null ? null : parseFloat(x)
  );
  if (vals.some(v => v === null || isNaN(v))) return null;
  return vals.reduce((a, b) => a + b, 0);
};
const scoreColor = (t) => { if (t === null) return "#64748b"; if (t >= 70) return "#00d4aa"; if (t >= 50) return "#ffb340"; return "#ff4757"; };
const letterGrade = (t) => { if (t === null) return "—"; if (t >= 80) return "A"; if (t >= 70) return "B"; if (t >= 60) return "C"; if (t >= 50) return "D"; return "F"; };

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: { background: "#0d0f14", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 13 },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0d0f14" },
  loginCard: { background: "#14171f", border: "1px solid #252a38", borderRadius: 12, padding: "40px 36px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" },
  loginTitle: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 },
  loginSub: { fontSize: 11, color: "#64748b", marginBottom: 28 },
  tab: (active) => ({ flex: 1, padding: "9px 0", background: active ? "#5b8cff" : "transparent", border: active ? "1px solid #5b8cff" : "1px solid #252a38", borderRadius: 6, color: active ? "#fff" : "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }),
  input: { width: "100%", background: "#1c2030", border: "1px solid #252a38", borderRadius: 6, padding: "10px 12px", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 },
  btn: (variant = "primary") => ({ width: "100%", padding: "11px", borderRadius: 6, border: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", background: variant === "primary" ? "#5b8cff" : "#14171f", color: variant === "primary" ? "#fff" : "#64748b", marginTop: 4 }),
  header: { background: "#14171f", borderBottom: "1px solid #252a38", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  h1: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 },
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: color + "22", color, border: `1px solid ${color}44` }),
};

// ─── Firebase helpers ─────────────────────────────────────────────────────────
async function loadGradesFromFirebase() {
  try {
    const snapshot = await getDocs(collection(db, "grades"));
    const result = {};
    snapshot.forEach(d => { result[d.id] = d.data(); });
    return result;
  } catch (e) { console.error("Firebase load error:", e); return {}; }
}

async function saveGradeToFirebase(studentId, form) {
  try {
    await setDoc(doc(db, "grades", studentId), { ...form, total: calcTotal(form), updatedAt: new Date().toISOString() });
  } catch (e) { console.error("Firebase save error:", e); }
}

async function loadStudentsFromFirebase() {
  try {
    const d = await getDoc(doc(db, "config", "students"));
    if (d.exists() && d.data().list) return d.data().list;
  } catch (e) { console.error("Firebase students load error:", e); }
  return null;
}

async function saveStudentsToFirebase(students) {
  try {
    await setDoc(doc(db, "config", "students"), { list: students, updatedAt: new Date().toISOString() });
  } catch (e) { console.error("Firebase students save error:", e); }
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, students }) {
  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (role === "lecturer") {
      if (password === LECTURER_PASSWORD) { onLogin("lecturer", null); }
      else { setError("Incorrect password."); }
    } else {
      const norm = studentId.trim().toUpperCase();
      const match = students.find(s => s.id.toUpperCase() === norm);
      if (match) { onLogin("student", match.id); }
      else { setError("Matricule number not found in the MAD400 roster."); }
    }
  };

  return (
    <div style={S.center}>
      <div style={S.loginCard}>
        <div style={S.loginTitle}>MAD400 Grading Portal</div>
        <div style={S.loginSub}>Mobile App Dev · Flutter Task Manager · Atumkeze · 2026</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button style={S.tab(role === "student")} onClick={() => { setRole("student"); setError(""); }}>Student</button>
          <button style={S.tab(role === "lecturer")} onClick={() => { setRole("lecturer"); setError(""); }}>Lecturer</button>
        </div>
        {role === "student" ? (
          <>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Enter your Matricule Number to view your grade</div>
            <input style={S.input} placeholder="e.g. LMUI250947" value={studentId}
              onChange={e => setStudentId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Lecturer password required</div>
            <input style={S.input} type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </>
        )}
        {error && <div style={{ fontSize: 11, color: "#ff4757", marginBottom: 8 }}>{error}</div>}
        <button style={S.btn("primary")} onClick={handleLogin}>
          {role === "student" ? "View My Grade" : "Sign In as Lecturer"}
        </button>
      </div>
    </div>
  );
}

// ─── Student View ─────────────────────────────────────────────────────────────
function StudentView({ studentId, grades, students, onLogout }) {
  const student = students.find(s => s.id === studentId);
  const g = grades[studentId] || {};
  const total = calcTotal(g);
  const letter = letterGrade(total);
  if (!student) return <div style={{ color: "#ff4757", padding: 40 }}>Student not found.</div>;
  const criteria = [
    { key: "s1", label: "Foundation & Setup", max: 20 },
    { key: "s2", label: "Core Functionality", max: 30 },
    { key: "s3", label: "Advanced Features", max: 30 },
    { key: "s4", label: "UI Polish", max: 10 },
    { key: "s5", label: "Code Quality", max: 10 },
  ];
  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <div style={S.h1}>MAD400 — My Grade</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Flutter Task Manager Exercise</div>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "1px solid #252a38", borderRadius: 6, padding: "6px 14px", color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer" }}>Sign Out</button>
      </div>
      <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 24px" }}>
        <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 10, padding: 24, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{student.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{student.id} · {student.dept}</div>
          {student.flags && student.flags.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {student.flags.map((f, i) => (
                <div key={i} style={{ ...S.badge(f.type === "critical" ? "#ff4757" : "#ffb340"), display: "block", marginBottom: 4, padding: "4px 10px" }}>
                  {f.type === "critical" ? "🔴" : "🟡"} {f.msg}
                </div>
              ))}
            </div>
          )}
        </div>
        {total === null ? (
          <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 10, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Your grade has not been posted yet.</div>
            <div style={{ fontSize: 11, color: "#464e5e" }}>Check back later or contact your lecturer.</div>
          </div>
        ) : (
          <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 10, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>TOTAL SCORE</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: scoreColor(total), lineHeight: 1 }}>
                  {total}<span style={{ fontSize: 18, color: "#64748b" }}>/100</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, color: scoreColor(total), lineHeight: 1 }}>{letter}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>GRADE</div>
              </div>
            </div>
            <div style={{ background: "#1c2030", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ width: `${total}%`, height: "100%", background: scoreColor(total), borderRadius: 4, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Score Breakdown</div>
            {criteria.map(c => {
              const val = g[c.key] !== undefined && g[c.key] !== "" ? parseFloat(g[c.key]) : null;
              return (
                <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, fontSize: 12 }}>{c.label}</div>
                  <div style={{ width: 80, background: "#1c2030", borderRadius: 3, height: 4, overflow: "hidden" }}>
                    <div style={{ width: val !== null ? `${(val / c.max) * 100}%` : "0%", height: "100%", background: val !== null ? scoreColor((val / c.max) * 100) : "#252a38" }} />
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: val !== null ? scoreColor((val / c.max) * 100) : "#464e5e", minWidth: 50, textAlign: "right" }}>
                    {val !== null ? `${val}/${c.max}` : `—/${c.max}`}
                  </div>
                </div>
              );
            })}
            {g.notes && (
              <div style={{ marginTop: 16, padding: "12px 14px", background: "#1c2030", borderRadius: 6, borderLeft: "3px solid #5b8cff" }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Lecturer Notes</div>
                <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.6 }}>{g.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Student Modal ────────────────────────────────────────────────────────
function AddStudentModal({ onAdd, onClose, existingIds }) {
  const [form, setForm] = useState({ name: "", id: "", dept: "Software Engineering", github: "", recording: "", collab: "Yes", files: "5" });
  const [error, setError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleAdd = () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.id.trim()) { setError("Matricule number is required."); return; }
    if (existingIds.includes(form.id.trim().toUpperCase())) { setError("This Matricule number already exists."); return; }
    onAdd({ ...form, id: form.id.trim(), name: form.name.trim(), flags: [] });
    onClose();
  };
  const iStyle = { width: "100%", background: "#1c2030", border: "1px solid #252a38", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 10 };
  const lStyle = { fontSize: 10, color: "#64748b", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 12, padding: 28, width: 480, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", right: 20, top: 18, background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>×</button>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Add New Student</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 20 }}>Manually add a student to the MAD400 roster</div>
        <label style={lStyle}>Full Name *</label>
        <input style={iStyle} placeholder="e.g. JOHN DOE SMITH" value={form.name} onChange={e => set("name", e.target.value)} />
        <label style={lStyle}>Matricule Number *</label>
        <input style={iStyle} placeholder="e.g. LMUI250999" value={form.id} onChange={e => set("id", e.target.value)} />
        <label style={lStyle}>Department</label>
        <input style={iStyle} placeholder="Software Engineering" value={form.dept} onChange={e => set("dept", e.target.value)} />
        <label style={lStyle}>GitHub Repo URL</label>
        <input style={iStyle} placeholder="https://github.com/username/MAD400-..." value={form.github} onChange={e => set("github", e.target.value)} />
        <label style={lStyle}>Screen Recording URL</label>
        <input style={iStyle} placeholder="https://drive.google.com/..." value={form.recording} onChange={e => set("recording", e.target.value)} />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={lStyle}>Collaborator Added?</label>
            <select value={form.collab} onChange={e => set("collab", e.target.value)} style={{ ...iStyle }}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={lStyle}>File Count</label>
            <select value={form.files} onChange={e => set("files", e.target.value)} style={{ ...iStyle }}>
              <option value="5">5</option>
              <option value="6–8">6–8</option>
              <option value="9+">9+</option>
            </select>
          </div>
        </div>
        {error && <div style={{ fontSize: 11, color: "#ff4757", marginBottom: 10 }}>⚠ {error}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={onClose} style={{ background: "#1c2030", border: "1px solid #252a38", borderRadius: 6, padding: "8px 20px", color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleAdd} style={{ background: "#00d4aa", border: "none", borderRadius: 6, padding: "8px 20px", color: "#0d0f14", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Add Student</button>
        </div>
      </div>
    </div>
  );
}

// ─── Grade Modal ──────────────────────────────────────────────────────────────
function GradeModal({ student, grades, onSave, onClose }) {
  const existing = grades[student.id] || {};
  const [form, setForm] = useState({ s1: existing.s1 ?? "", s2: existing.s2 ?? "", s3: existing.s3 ?? "", s4: existing.s4 ?? "", s5: existing.s5 ?? "", notes: existing.notes ?? "" });
  const [saving, setSaving] = useState(false);
  const criteria = [
    { key: "s1", label: "Foundation & Setup", max: 20 },
    { key: "s2", label: "Core Functionality", max: 30 },
    { key: "s3", label: "Advanced Features", max: 30 },
    { key: "s4", label: "UI Polish", max: 10 },
    { key: "s5", label: "Code Quality", max: 10 },
  ];
  const total = calcTotal(form);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    await onSave(student.id, form);
    setSaving(false);
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 12, padding: 28, width: 520, maxHeight: "88vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", right: 20, top: 18, background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>×</button>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{student.name}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 20 }}>{student.id} · {student.dept}</div>
        {student.flags && student.flags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {student.flags.map((f, i) => (
              <span key={i} style={{ ...S.badge(f.type === "critical" ? "#ff4757" : "#ffb340"), marginRight: 6, marginBottom: 4, display: "inline-block" }}>
                {f.type === "critical" ? "🔴" : "🟡"} {f.msg}
              </span>
            ))}
            <div style={{ borderTop: "1px solid #252a38", marginTop: 12, paddingTop: 12 }} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Links</div>
          <div style={{ fontSize: 11 }}>
            {!student.github || student.github.startsWith("[")
              ? <span style={{ color: "#ff4757" }}>⚠ {student.github || "No GitHub link"}</span>
              : <a href={student.github} target="_blank" rel="noreferrer" style={{ color: "#5b8cff", textDecoration: "none" }}>⎈ GitHub</a>}
            <span style={{ margin: "0 8px", color: "#252a38" }}>|</span>
            {!student.recording || student.recording.startsWith("[")
              ? <span style={{ color: "#ff4757" }}>✗ {student.recording || "No recording"}</span>
              : <a href={student.recording} target="_blank" rel="noreferrer" style={{ color: "#00d4aa", textDecoration: "none" }}>▶ Recording</a>}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #252a38", paddingTop: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Grading</div>
          {criteria.map(c => {
            const val = form[c.key] !== "" ? parseFloat(form[c.key]) : null;
            const valid = val === null || (val >= 0 && val <= c.max);
            return (
              <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1, fontSize: 12 }}>{c.label}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>/{c.max}</div>
                <input type="number" min={0} max={c.max} step={0.5} value={form[c.key]}
                  onChange={e => set(c.key, e.target.value)}
                  style={{ width: 60, background: "#1c2030", border: `1px solid ${!valid ? "#ff4757" : "#252a38"}`, borderRadius: 4, padding: "5px 8px", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 13, textAlign: "center", outline: "none" }} />
              </div>
            );
          })}
        </div>
        <div style={{ background: "#1c2030", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>Total</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: scoreColor(total) }}>
            {total !== null ? `${total}/100` : "—"}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Notes (optional)</div>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
            style={{ width: "100%", background: "#1c2030", border: "1px solid #252a38", borderRadius: 6, padding: "10px 12px", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 12, resize: "vertical", minHeight: 72, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "#1c2030", border: "1px solid #252a38", borderRadius: 6, padding: "8px 20px", color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#3a5cbf" : "#5b8cff", border: "none", borderRadius: 6, padding: "8px 20px", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, cursor: saving ? "wait" : "pointer" }}>
            {saving ? "Saving…" : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lecturer Dashboard ───────────────────────────────────────────────────────
function LecturerDashboard({ grades, students, onSave, onAddStudent, onLogout }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [modal, setModal] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const isFlagged = s => s.flags && s.flags.length > 0;
  const hasNoRec = s => !s.recording || s.recording.startsWith("[");
  const hasNoCollab = s => s.collab === "No";

  const filtered = students.map((s, i) => ({ ...s, _i: i })).filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q);
    if (!matchQ) return false;
    const total = calcTotal(grades[s.id]);
    if (filter === "flagged") return isFlagged(s);
    if (filter === "no-recording") return hasNoRec(s);
    if (filter === "no-collaborator") return hasNoCollab(s);
    if (filter === "graded") return total !== null;
    if (filter === "ungraded") return total === null;
    return true;
  }).sort((a, b) => {
    if (!sort) return 0;
    if (sort === "total") { const at = calcTotal(grades[a.id]) ?? -1; const bt = calcTotal(grades[b.id]) ?? -1; return (at - bt) * sortDir; }
    return String(a[sort]).localeCompare(String(b[sort])) * sortDir;
  });

  const allTotals = students.map(s => calcTotal(grades[s.id])).filter(x => x !== null);
  const gradedCount = allTotals.length;
  const avg = gradedCount > 0 ? Math.round(allTotals.reduce((a, b) => a + b, 0) / gradedCount) : null;

  const toggleSort = (col) => { if (sort === col) setSortDir(d => d * -1); else { setSort(col); setSortDir(1); } };

  const handleSaveGrade = async (sid, form) => {
    await onSave(sid, form);
    showToast("Grade saved to cloud ✓");
  };

  const exportCSV = () => {
    const rows = [["#", "Name", "Student ID", "Department", "Collab", "Files", "Flags", "S1/20", "S2/30", "S3/30", "S4/10", "S5/10", "Total/100", "Notes"]];
    students.forEach((s, i) => {
      const g = grades[s.id] || {};
      const total = calcTotal(g);
      rows.push([i + 1, s.name, s.id, s.dept, s.collab, s.files, (s.flags || []).map(f => f.msg).join("; "), g.s1 || "", g.s2 || "", g.s3 || "", g.s4 || "", g.s5 || "", total !== null ? total : "", g.notes || ""]);
    });
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "MAD400_Grades.csv";
    a.click();
  };

  const filterBtns = [
    { key: "all", label: "All", count: students.length },
    { key: "flagged", label: "⚠ Flagged", count: students.filter(isFlagged).length },
    { key: "no-recording", label: "No Recording", count: students.filter(hasNoRec).length },
    { key: "no-collaborator", label: "No Collaborator", count: students.filter(hasNoCollab).length },
    { key: "graded", label: "Graded", count: gradedCount },
    { key: "ungraded", label: "Ungraded", count: students.length - gradedCount },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <div style={S.h1}>MAD400 — Grading Dashboard</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Lecturer: Atumkeze · Flutter Task Manager · Deadline: 16 May 2026</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[{ val: students.length, label: "Submissions", color: "#5b8cff" }, { val: students.filter(isFlagged).length, label: "Flagged", color: "#ffb340" }, { val: gradedCount, label: "Graded", color: "#00d4aa" }, { val: avg ?? "—", label: "Avg", color: "#e2e8f0" }].map(({ val, label, color }) => (
            <div key={label} style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
          <button onClick={onLogout} style={{ background: "none", border: "1px solid #252a38", borderRadius: 6, padding: "6px 14px", color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer" }}>Sign Out</button>
        </div>
      </div>
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <input style={{ ...S.input, width: 260, marginBottom: 0 }} placeholder="🔍 Search name, ID, dept…" value={search} onChange={e => setSearch(e.target.value)} />
          {filterBtns.map(fb => (
            <button key={fb.key} onClick={() => setFilter(fb.key)}
              style={{ background: filter === fb.key ? "#5b8cff" : "#14171f", border: `1px solid ${filter === fb.key ? "#5b8cff" : "#252a38"}`, borderRadius: 6, padding: "6px 12px", color: filter === fb.key ? "#fff" : "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
              {fb.label} <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "1px 6px", fontSize: 10 }}>{fb.count}</span>
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => setShowAdd(true)} style={{ background: "#00d4aa22", border: "1px solid #00d4aa44", borderRadius: 6, padding: "6px 14px", color: "#00d4aa", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>+ Add Student</button>
            <button onClick={exportCSV} style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 6, padding: "6px 14px", color: "#e2e8f0", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>Export CSV</button>
          </div>
        </div>
        <div style={{ background: "#14171f", border: "1px solid #252a38", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "8px 16px", fontSize: 11, color: "#64748b", borderBottom: "1px solid #252a38", display: "flex", justifyContent: "space-between" }}>
            <span>Showing {filtered.length} of {students.length} students</span>
            <span>Click any row to grade</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1c2030" }}>
                  {[["#", null], ["Name", "name"], ["ID", "id"], ["Dept", "dept"], ["Collab", null], ["Flags", null], ["Total /100", "total"]].map(([label, col]) => (
                    <th key={label} onClick={() => col && toggleSort(col)}
                      style={{ padding: "9px 12px", textAlign: "left", fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: sort === col ? "#5b8cff" : "#64748b", borderBottom: "1px solid #252a38", cursor: col ? "pointer" : "default", whiteSpace: "nowrap", userSelect: "none" }}>
                      {label}{sort === col ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, vi) => {
                  const total = calcTotal(grades[s.id]);
                  const isCritical = (s.flags || []).some(f => f.type === "critical");
                  return (
                    <tr key={s.id} onClick={() => setModal(s)}
                      style={{ borderBottom: "1px solid #252a38", cursor: "pointer", background: isCritical ? "rgba(255,71,87,0.04)" : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1c2030"}
                      onMouseLeave={e => e.currentTarget.style.background = isCritical ? "rgba(255,71,87,0.04)" : "transparent"}>
                      <td style={{ padding: "9px 12px", color: "#64748b", fontSize: 11 }}>{vi + 1}</td>
                      <td style={{ padding: "9px 12px" }}><div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>{s.name}</div></td>
                      <td style={{ padding: "9px 12px", fontSize: 11, color: "#64748b" }}>{s.id}</td>
                      <td style={{ padding: "9px 12px", fontSize: 11, color: "#e2e8f0" }}>{s.dept}</td>
                      <td style={{ padding: "9px 12px" }}><span style={S.badge(s.collab === "Yes" ? "#00d4aa" : "#ff4757")}>{s.collab === "Yes" ? "✓ Yes" : "✗ No"}</span></td>
                      <td style={{ padding: "9px 12px", maxWidth: 220 }}>
                        {!s.flags || s.flags.length === 0 ? <span style={{ fontSize: 10, color: "#464e5e" }}>—</span> :
                          s.flags.map((f, fi) => <div key={fi} style={{ fontSize: 10, color: f.type === "critical" ? "#ff4757" : "#ffb340", marginBottom: 2 }}>{f.type === "critical" ? "🔴" : "🟡"} {f.msg.slice(0, 45)}{f.msg.length > 45 ? "…" : ""}</div>)}
                      </td>
                      <td style={{ padding: "9px 12px" }}><span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: scoreColor(total) }}>{total ?? "—"}</span></td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No students match.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modal && <GradeModal student={modal} grades={grades} onSave={handleSaveGrade} onClose={() => setModal(null)} />}
      {showAdd && <AddStudentModal onAdd={onAddStudent} onClose={() => setShowAdd(false)} existingIds={students.map(s => s.id.toUpperCase())} />}
      {toast && <div style={{ position: "fixed", bottom: 24, right: 24, background: "#00d4aa", color: "#0d0f14", padding: "10px 18px", borderRadius: 8, fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,212,170,0.3)", zIndex: 500 }}>{toast}</div>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [grades, setGrades] = useState({});
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [fbGrades, fbStudents] = await Promise.all([loadGradesFromFirebase(), loadStudentsFromFirebase()]);
      setGrades(fbGrades);
      if (fbStudents && fbStudents.length > 0) setStudents(fbStudents);
      setLoading(false);
    })();
  }, []);

  const saveGrade = async (studentId, form) => {
    const newGrades = { ...grades, [studentId]: { ...form, total: calcTotal(form) } };
    setGrades(newGrades);
    await saveGradeToFirebase(studentId, form);
  };

  const addStudent = async (newStudent) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    await saveStudentsToFirebase(updated);
  };

  if (loading) {
    return (
      <div style={{ ...S.center, flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#5b8cff", fontWeight: 700 }}>MAD400 Portal</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Connecting to database…</div>
      </div>
    );
  }

  if (!session) return <LoginScreen onLogin={(role, id) => setSession({ role, id })} students={students} />;
  if (session.role === "lecturer") return <LecturerDashboard grades={grades} students={students} onSave={saveGrade} onAddStudent={addStudent} onLogout={() => setSession(null)} />;
  return <StudentView studentId={session.id} grades={grades} students={students} onLogout={() => setSession(null)} />;
}
