// MIGNITH MURDER MYSTERY IN A DARK ROOM - Game Script
// TABLE OF CONTENTS:
// 1. GLOBAL VARIABLES (Line 8)
// 2. SCENES DEFINITION (Line 18)
//    - Intro & Accuse Scenes (Line 19)
//    - Main Suspects (Line 100)
//    - Extra Suspects (Line 300+)
// 3. FUNCTIONS (Line 800+)
//    - Init & Display (Line 801)
//    - Event Handling (Line 850)
//    - Game State (Line 900)

//region 1. GLOBAL VARIABLES
let outputDiv;
let optionsDiv;
let accuseContainer;
let currentScene = 'intro';
let welcomeDiv;
let leoPicDiv;
let currentOptions = [];
let typingTimeout;
const TYPE_SPEED = 12;
let typewriterSound;
let celebrationSound;
let clickSound;
let isTyping = false;
let currentTypingText = '';
let currentTypingCallback = null;
let buttonsAnimating = false;
let autoSaveEnabled = true;
let autoSaveInterval = null;
let achievements = {
    openedNotepad: false,
    openedBrowser: false,
    completedProgressBar: false,
    accusedAllCharacters: false,
    accused: {} // Will store {characterName: true} for each accused character
};
const CHARACTER_NAMES = [
    'Marcus', 'Tongyu', 'Derek', 'Kacper', 'Patricia', 'Simon', 'Jane',
    'Rachel', 'Vincent', 'Herby', 'Gloria', 'Boris', 'Natasha', 'Felix', 'Euan',
    'Bethany', 'Leonard', 'Yvonne', 'Malcolm', 'Sophia', 'Gregory', 'Heather',
    'Theodore', 'Millicent', 'Leo', 'Dev', 'Ren Ran', 'Rayane', 'Alex', 'Reem'
];

// Game state variables
let kacper_cooked = false;
let tongyu_salad_shared = false;
let euan_salad_told = false;
let marcus_package_received = false;
let simon_calculator_seen = false;
let felix_watched = false;
let leo_coffee_known = false;

// Track visited scenes
let visitedScenes = new Set();

// Track dialogue repetitions
let dialogueRepetitions = {};
let currentCharacter = null;
//endregion

//region 2. SCENES DEFINITION
const scenes = {
    //region Intro Scene
    intro: {
        text: '════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n                                                           WELCOME TO MIDNIGHT\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n',
        options: [ 
            { text: 'Marcus', nextScene: 'marcus' },
            { text: 'Tongyu', nextScene: 'tongyu' },
            { text: 'Derek', nextScene: 'derek' },
            { text: 'Kacper', nextScene: 'kacper' },
            { text: 'Patricia', nextScene: 'patricia' },
            { text: 'Simon', nextScene: 'simon' },
            { text: 'Jane', nextScene: 'jane' },
            { text: 'Rachel', nextScene: 'rachel' },
            { text: 'Vincent', nextScene: 'vincent' },
            { text: 'Herby', nextScene: 'herby' },
            { text: 'Gloria', nextScene: 'gloria' },
            { text: 'Boris', nextScene: 'boris' },
            { text: 'Natasha', nextScene: 'natasha' },
            { text: 'Felix', nextScene: 'felix' },
            { text: 'Euan', nextScene: 'euan' },
            { text: 'Bethany', nextScene: 'bethany' },
            { text: 'Leonard', nextScene: 'leonard' },
            { text: 'Yvonne', nextScene: 'yvonne' },
            { text: 'Malcolm', nextScene: 'malcolm' },
            { text: 'Sophia', nextScene: 'sophia' },
            { text: 'Gregory', nextScene: 'gregory' },
            { text: 'Heather', nextScene: 'heather' },
            { text: 'Theodore', nextScene: 'theodore' },
            { text: 'Millicent', nextScene: 'millicent' },
            { text: 'Leo', nextScene: 'leo' },
            { text: 'Dev', nextScene: 'dev' },
            { text: 'Ren Ran', nextScene: 'ren_ran' },
            { text: 'Rayane', nextScene: 'rayane' },
            { text: 'Alex', nextScene: 'alex' },
            { text: 'Reem', nextScene: 'reem' }
        ]
    //endregion
    },
    //region Kacper Scenes
    kacper: {
        text: 'Kacper is the new cook, this is his first day working for your aunt just when she died.\n\n',
        options: [
            { text: 'Ask about his alibi', nextScene: 'kacper_alibi' },
            { text: 'Ask about the murder weapon', nextScene: 'kacper_weapon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    kacper_alibi: {
        text: 'Kacper says he was in the kitchen all day ordering salad from Glovo because he can\'t cook.\n\n',
        options: [
            { text: 'Ask about the murder weapon', nextScene: 'kacper_weapon' },
            { text: 'Back to Kacper', nextScene: 'kacper' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    kacper_weapon: {
        text: 'Kacper claims he doesn\'t know anything about the knife from the kitchen found at the scene.\n\n',
        options: [
            { text: 'Ask about his alibi', nextScene: 'kacper_alibi' },
            { text: 'Back to Kacper', nextScene: 'kacper' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    kacper_meal: {
        text: 'Kacper gives you the tomato salad he ordered from Glovo.\n\n',
        options: [
            { text: 'Ask about his alibi', nextScene: 'kacper_alibi' },
            { text: 'Back to Kacper', nextScene: 'kacper' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    //endregion
    },
    //region Jane Scenes
    jane: {
        text: 'Jane is your aunt\'s longtime friend. She constantly hangs out and parties with her.\n\n',
        options: [
            { text: 'Ask about her relationship with your aunt', nextScene: 'jane_relationship' },
            { text: 'Ask about the day of the murder', nextScene: 'jane_day' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        jane_relationship: {
            text: 'Jane says she and your aunt were very close, like family.\n\n',
            options: [
                { text: 'Ask about the day of the murder', nextScene: 'jane_day' },
                { text: 'Back to Jane', nextScene: 'jane' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        jane_day: {
            text: 'Jane says she was at a party in another country all day.\n\n',
            options: [
                { text: 'Ask about her relationship with your aunt', nextScene: 'jane_relationship' },
                { text: 'Back to Jane', nextScene: 'jane' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
    //endregion
    //region Tongyu Scenes
    tongyu: {
        text: 'Tongyu is the gardener obsessed with salad.. She\'s been with the family for years.\n\n',
        options: [
            { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
            { text: 'Ask about suspicious activity', nextScene: 'tongyu_activity' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        tongyu_garden: {
            text: 'Tongyu says the garden is doing good and that the plants are growing, however the vegetables look like they haven\'t been watered for 67 years.\n\n',
            options: [
                { text: 'Ask about suspicious activity', nextScene: 'tongyu_activity' },
                { text: 'Back to Tongyu', nextScene: 'tongyu' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        tongyu_activity: {
            text: 'Tongyu mentions seeing someone near the house the day before, however, she cannot remember well.\n\n',
            options: [
                { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
                { text: 'Back to Tongyu', nextScene: 'tongyu' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
            tongyu_salad: {
                text: 'Tongyu thanks you for the salad, and mentions how this is the salesman favorite food.\n\n',
                options: [
                    { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
                    { text: 'Back to Tongyu', nextScene: 'tongyu' },
                    { text: 'Back to interrogation room', nextScene: 'intro' }
                ]
            },
    //endregion
    //region Herby Scenes
    herby: {
        text: 'Herby is the chaffeur who lost his job as a healer. She looks worried.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'herby_car' },
            { text: 'Ask about her whereabouts', nextScene: 'herby_whereabouts' },
            { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        herby_car: {
            text: 'Herby says the car is a deluxe supreme Apple iCar Pro 17+ with an orange colored exterior that looks like a traffic cone.\n\n',
            options: [
                { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
                { text: 'Ask about why he cared about the salad ingredients', nextScene: 'herby_salad_care' },
                { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_whereabouts: {
            text: 'Herby claims she drove the car to get the ingredients for the salad at .\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about why she cared about the salad ingredients', nextScene: 'herby_salad_care' }, 
                { text: 'Ask why she\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_healer: {
            text: 'Herby says she wanted to be a healer, but the LORE did not allow it.\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about her whereabouts', nextScene: 'herby_whereabouts' },
                { text: 'Ask about why she cared about the salad ingredients', nextScene: 'herby_salad_care' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_salad_care: {
            text: 'Herby says that Euan was pressuring him to get them as fast as possible.\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about her whereabouts', nextScene: 'herby_whereabouts'},
                { text: 'Ask why she\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        }
    ,
    //endregion
    //region Euan Scenes
    euan: {
        text: 'Euan is William Daniel, now trying to reform and become an honest salesman guy. He\'s very formal and composed.\n\n',
        options: [
            { text: 'Ask about the price of the household', nextScene: 'euan_price' },
            { text: 'Ask about what you got in your will', nextScene: 'euan_will' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        euan_price: {
            text: 'Euan states that it is private.\n\n',
            options: [
                { text: 'Ask about his favorite type of salad', nextScene: 'euan_salad' },
                { text: 'Ask about what you got in your will', nextScene: 'euan_will' },
                { text: 'Back to Euan', nextScene: 'euan' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        euan_will: {
            text: 'Euan looks at you straight in the eyes as if he was staring into your soul and says: \"A depressed crow. AND HACKCLUB MERCH YAY!!!\"\n\n',
            options: [
                { text: 'Ask about the price of the household', nextScene: 'euan_price' },
                { text: 'Ask about his favorite type of salad', nextScene: 'euan_salad' },
                { text: 'Back to Euan', nextScene: 'euan' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        euan_salad: {
            text: 'Eaun begins rambling about his love for salad forgetting the origial question. However, he does mention that the chauffeur was very particular about getting the ingredients on time.\n\n',
            options: [
                { text: 'Ask about the price of the household', nextScene: 'euan_price' },
                { text: 'Ask about what you got in your will', nextScene: 'euan_will' },
                { text: 'Back to Euan', nextScene: 'euan' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
    //endregion
    //region Accuse Scene
    accuse: {
        text: 'Who do you accuse of murdering your aunt?\n\n',
        options: [
            { text: 'Marcus', nextScene: 'accuse_marcus' },
            { text: 'Tongyu', nextScene: 'accuse_tongyu' },
            { text: 'Derek', nextScene: 'accuse_derek' },
            { text: 'Kacper', nextScene: 'accuse_kacper' },
            { text: 'Patricia', nextScene: 'accuse_patricia' },
            { text: 'Simon', nextScene: 'accuse_simon' },
            { text: 'Jane', nextScene: 'accuse_jane' },
            { text: 'Rachel', nextScene: 'accuse_rachel' },
            { text: 'Vincent', nextScene: 'accuse_vincent' },
            { text: 'Herby', nextScene: 'accuse_herby' },
            { text: 'Gloria', nextScene: 'accuse_gloria' },
            { text: 'Boris', nextScene: 'accuse_boris' },
            { text: 'Natasha', nextScene: 'accuse_natasha' },
            { text: 'Felix', nextScene: 'accuse_felix' },
            { text: 'Euan', nextScene: 'accuse_euan' },
            { text: 'Bethany', nextScene: 'accuse_bethany' },
            { text: 'Leonard', nextScene: 'accuse_leonard' },
            { text: 'Yvonne', nextScene: 'accuse_yvonne' },
            { text: 'Malcolm', nextScene: 'accuse_malcolm' },
            { text: 'Sophia', nextScene: 'accuse_sophia' },
            { text: 'Gregory', nextScene: 'accuse_gregory' },
            { text: 'Heather', nextScene: 'accuse_heather' },
            { text: 'Theodore', nextScene: 'accuse_theodore' },
            { text: 'Millicent', nextScene: 'accuse_millicent' },
            { text: 'Leo', nextScene: 'accuse_leo' },
            { text: 'Dev', nextScene: 'accuse_dev' },
            { text: 'Ren Ran', nextScene: 'accuse_renran' },
            { text: 'Rayane', nextScene: 'accuse_rayane' },
            { text: 'Alex', nextScene: 'accuse_alex' },
            { text: 'Reem', nextScene: 'accuse_reem' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    //region Accusation Endings
    accuse_marcus: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Marcus the mailman.\n\nMarcus vehemently denies it. "I delivered mail at exactly 3:47 PM, just like always! I have timestamps, witnesses, my entire route schedule! You can\'t just accuse me because I\'m nervous—I\'m ALWAYS nervous!" He insists he had no reason to harm your aunt and demands you check his mail records.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_tongyu: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Tongyu the gardener.\n\nTongyu shakes his head. "No, no, no! The plants—they would tell me if I did such a thing! The garden knows I am innocent. I loved your aunt\'s garden like my own. Why would I destroy what I cherish most?" He points to the roses outside, claiming they bloom only for the innocent.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_derek: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Derek the pool cleaner.\n\nDerek protests. "The chlorine levels? That\'s just chemistry! It fluctuates based on temperature and pH balance. I was CLEANING the pool, not poisoning anyone! Check my work logs—I was nowhere near your aunt that day!" His tan face turns red with frustration.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_kacper: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Kacper the cook.\n\nKacper panics. "No! It\'s my first day! Why would I ruin my career before it even starts? The salad was FRESH—I can prove it! I was just nervous because everything was new! Please, taste my food, it\'s not poisoned!" He offers to make you another dish to prove his innocence.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_patricia: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Patricia the piano tuner.\n\nPatricia\'s eyes narrow. "The 2 Hz discrepancy was because someone TOUCHED the piano after I tuned it! My work is PERFECT. I would never harm anyone over criticism—I\'ve heard worse from actual professionals. Your aunt respected my craft." She demands you check the piano for fingerprints.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_simon: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Simon the accountant.\n\nSimon pulls out his ledger. "The numbers don\'t lie, and neither do I! Every transaction is documented, timestamped, and verified. If there were discrepancies, it\'s because someone ELSE was stealing! I was trying to HELP your aunt, not kill her!" He shows you pages of financial records.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_jane: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Jane the friend.\n\nJane breaks down crying. "She was my FRIEND! My best friend! How could you think I\'d hurt her? Yes, I have a past, but she was helping me move forward, not threatening me! You\'re making a terrible mistake!" She sobs uncontrollably, insisting you\'ve got it all wrong.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_rachel: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Rachel the dog walker.\n\nRachel shakes her head vigorously. "I walk DOGS, I don\'t KILL people! The timing contradictions? I walk multiple houses—of course my schedule varies! Your aunt never even had dogs for me to walk here! Check my client list!" She pulls out her phone showing her route schedule.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_vincent: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Vincent the antique dealer.\n\nVincent looks offended. "Forgeries? FORGERIES?! I deal only in authentic pieces! Your aunt trusted me with her collection for YEARS. The antiques themselves would reject me if I\'d done such a thing—they have energy, they KNOW!" He insists every piece has proper authentication documents.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_herby: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Herby the delivery driver.\n\nHerby stammers nervously. "I-I was just delivering salad ingredients! The rush was because the restaurant called late! I\'m always nervous when I drive—that\'s just who I am! I have a clean driving record, you can check!" He fumbles for his driver\'s license to prove his innocence.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_gloria: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Gloria the librarian.\n\nGloria adjusts her glasses indignantly. "Book forgeries? I\'m a LIBRARIAN, not a criminal! I track overdue books because that\'s my JOB. Your aunt always returned her books on time—she was one of my favorite patrons! This accusation is absurd!" She pulls out library records showing your aunt\'s borrowing history.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_boris: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Boris the ice sculptor.\n\nBoris responds poetically. "Ice melts, truth remains. My sculptures are pure art, frozen beauty, nothing more. Your aunt admired my work—why would I shatter that relationship like ice beneath a hammer? The cold preserves, it does not kill." He maintains his artistic innocence.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_natasha: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Natasha the yoga instructor.\n\nNatasha takes a deep breath. "I teach yoga and mindfulness. Healing crystals are spiritual tools, not medicine. I never claimed otherwise. Your aunt attended my classes regularly—we had a peaceful relationship. Violence contradicts everything I believe in." She remains eerily calm despite the accusation.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_felix: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Felix the watch repairman.\n\nFelix checks his watch nervously. "My watch being 2 minutes slow is a MECHANICAL issue, not evidence! I repair timepieces, I don\'t fence jewelry! Your aunt brought her watches to me for years—she trusted me! Check my inventory, everything is legitimate!" He insists his obsession with time is just professionalism.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_euan: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Euan the accountant.\n\nEuan looks shocked. "Embezzling? I was the one who SUGGESTED the independent audit! Why would I do that if I was stealing? Every penny is accounted for in my ledgers. If there are discrepancies, someone else caused them. I\'ve served your family faithfully for years!" He opens his briefcase to show financial records.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_bethany: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Bethany the interior designer.\n\nBethany responds in her neutral tone. "Your aunt had strong opinions about design, yes. But criticism is part of my profession. I\'ve worked with far more difficult clients. My knowledge of the house layout is from DESIGNING it, not from planning a murder. This accusation is... disappointing." Her expression remains unreadable.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_leonard: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Leonard the electrician.\n\nLeonard starts counting under his breath. "400... 400... always 400. Your aunt never mocked me—she UNDERSTOOD me. She let me work at my own pace. 401 times? No. Never. Always 400. The wiring is SAFE. I would never... 400... 400..." He continues counting, insisting you\'ve made an error.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_yvonne: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Yvonne the journalist.\n\nYvonne pulls out her notepad. "Fabricated stories? I\'m an INVESTIGATIVE journalist! Your aunt was a source, not a threat! The contradictory times are because I interview multiple people—that\'s how journalism WORKS. You\'re confusing thorough reporting with guilt!" She insists on documenting this "false accusation" for her next column.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_malcolm: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Malcolm the chess instructor.\n\nMalcolm shakes his head. "Banned from professional chess? Show me the documentation! I teach chess because I love the game, not because I\'m hiding something. Your aunt enjoyed our lessons. Accusing me is a poor strategic move on your part—you\'ve sacrificed your queen for nothing." He challenges you to prove your claim.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_sophia: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Sophia the calligrapher.\n\nSophia\'s hand remains steady as she writes. "Forging signatures? I create ART, not forgeries! Your aunt hired me specifically BECAUSE of my integrity. Every document I\'ve penned for her is legitimate and witnessed. My fountain pens create beauty, not violence." She shows you samples of her commissioned work.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_gregory: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Gregory the meteorologist.\n\nGregory checks his barometer. "Falsified weather data? My predictions are based on SCIENCE! The barometric pressure readings are all documented and peer-reviewed. Your aunt consulted me about weather patterns—she never accused me of fraud. You can\'t manipulate atmospheric conditions!" He shows you meteorological charts.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_heather: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Heather the fitness trainer.\n\nHeather continues counting. "367... 368... Your aunt was in GREAT shape! Why would she sue me? 369... 370... My training is professional and safe! 371... The lunges help me focus, not cope with guilt! 372... You\'re interrupting my workout with false accusations! 373..." She refuses to stop her exercise routine.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_theodore: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Theodore the locksmith.\n\nTheodore\'s keys jangle as he protests. "Duplicate keys for burglaries? I keep detailed records of every key I make! Your aunt trusted me with her security! Key 867 was made with her explicit permission for emergency access. I\'m a LOCKSMITH, not a burglar!" He offers to show his key registry.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_millicent: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Millicent the clock collector.\n\nMillicent checks her 23 clocks. "Sell the estate? Your aunt never mentioned that! And I don\'t covet her clocks—I have my OWN collection! The synchronized timing is simply proper maintenance. Every clock here is precisely calibrated. Time doesn\'t lie, and neither do I." All her clocks tick in perfect harmony.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_leo: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Leo the motivational speaker.\n\nLeo smiles sadly. "Everyone has a past, friend. I\'ve always been open about mine—it\'s part of my story of growth and positivity! Your aunt supported my journey; she never threatened me. This accusation is a negative energy I won\'t accept. Stay positive, and find the real truth!" He maintains his optimistic demeanor.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_dev: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Dev the Santa impersonator.\n\nDev\'s jolly demeanor fades. "HO HO... No. Charity scam? Every donation is documented and goes directly to children! Your aunt even VOLUNTEERED at my Christmas events! She knew the charity was legitimate! Check the records—I\'m on the NICE list, not the naughty one!" He shows you charity receipts.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_renran: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Ren Ran the HR specialist.\n\nRen Ran pulls out her metrics tablet. "Team morale is at 98% because we have excellent workplace practices! Your aunt never contacted us about harassment—that would have been documented! All our metrics are verified through anonymous surveys. This accusation drops my morale from 98% to 45%!" She shows you certified HR reports.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_rayane: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Rayane the programmer.\n\nRayane looks up from his laptop. "Hacking software? Dude, it\'s literally just a murder mystery game! You can see the source code on GitHub—it\'s public! Your aunt thought it was cool, she even playtested it! The Git commits are REAL, you can verify the timestamps with GitHub\'s servers!" He offers to show you his repository.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_alex: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Alex the accountant.\n\nAlex remains calm. "Financial irregularities? Our firm undergoes regular audits—everything is transparent. Your aunt consulted me for financial advice; she trusted me. I was at the library, you can check with the librarian. My calm demeanor is just my personality, not evidence of guilt." He offers to provide his firm\'s audit reports.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    accuse_reem: {
        text: '<span class="congratulations">Case Closed?</span>\n\nYou accuse Reem the courier.\n\nReem talks at lightning speed. "What-no-no-no-I-was-delivering-packages-all-day-34-stops-I-saw-Herby-and-Tongyu-and-Marcus-I-have-receipts-signatures-timestamps-GPS-tracking-on-my-van-check-my-phone-check-my-logs-I-can-prove-where-I-was-every-single-minute-I-don\'t-even-KNOW-your-aunt-I-just-deliver-packages!" She barely pauses to breathe, insisting on her innocence.\n\nThe case is closed... but did you accuse the right person?',
        options: [{ text: 'Restart', nextScene: 'restart' }]
    },
    //endregion
    //region Extra Suspects
    marcus: {
        text: 'Marcus is the mailman. He seems extremely nervous, constantly checking his watch and looking over his shoulder. He\'s been delivering mail in this neighborhood for nearly a decade.\n\n',
        options: [
            { text: 'Ask about the mail schedule', nextScene: 'marcus_mail' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    marcus_mail: {
        text: 'Marcus insists he delivered mail at exactly 3:47 PM every Tuesday for the past 3 years. This seems VERY specific. He also mentions it was raining heavily on the day of the murder, which made his rounds difficult.\n\n',
        options: [
            { text: 'Back to Marcus', nextScene: 'marcus' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    marcus_package: {
        text: 'Marcus reluctantly gives you the mysterious overseas package. Inside you find... a receipt from Olivia\'s Flower Shop for "Special Order Orchids." Marcus mentions the package arrived on the same day as the purple orchids!\n\n',
        options: [
            { text: 'Ask Marcus about the connection', nextScene: 'marcus_connect' },
            { text: 'Back to Marcus', nextScene: 'marcus' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    marcus_connect: {
        text: 'Marcus says he saw Olivia and the florist having a "heated conversation" the day before the murder. He couldn\'t hear what they said, but they both seemed upset. This must mean something!\n\n',
        options: [
            { text: 'Back to Marcus', nextScene: 'marcus' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek: {
        text: 'Derek is the pool cleaner. He looks suspiciously tan.\n\n',
        options: [
            { text: 'Ask about pool chemicals', nextScene: 'derek_chemicals' },
            { text: 'Ask about his tan', nextScene: 'derek_tan' },
            { text: 'Ask about water levels', nextScene: 'derek_water' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek_chemicals: {
        text: 'Derek mentions he noticed the chlorine levels were 0.3% higher than usual. He says this is HIGHLY unusual. He also mentions that Kacper the cook was very particular about only using filtered water. Derek found this "suspicious."\n\n',
        options: [
            { text: 'Ask about his tan', nextScene: 'derek_tan' },
            { text: 'Ask about water levels', nextScene: 'derek_water' },
            { text: 'Back to Derek', nextScene: 'derek' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek_tan: {
        text: 'Derek explains his tan comes from working outdoors. He specifically mentions it was sunny and cloudless on the day of the murder - perfect pool cleaning weather. He remembers because he saw the mailman arrive right on schedule.\n\n',
        options: [
            { text: 'Ask about pool chemicals', nextScene: 'derek_chemicals' },
            { text: 'Ask about water levels', nextScene: 'derek_water' },
            { text: 'Back to Derek', nextScene: 'derek' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek_water: {
        text: 'The pool water was exactly 6.7 inches lower than regulation. Derek seems to think this is a CRUCIAL detail.\n\n',
        options: [
            { text: 'Ask about pool chemicals', nextScene: 'derek_chemicals' },
            { text: 'Ask about his tan', nextScene: 'derek_tan' },
            { text: 'Back to Derek', nextScene: 'derek' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    patricia: {
        text: 'Patricia is the piano tuner. She\'s wearing all black, and has a very serious demeanor. She\'s been maintaining your aunt\'s piano for several years and takes great pride in her meticulous work.\n\n',
        options: [
            { text: 'Ask about the piano', nextScene: 'patricia_piano' },
            { text: 'Ask why she\'s wearing black', nextScene: 'patricia_black' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    patricia_piano: {
        text: 'Patricia says the piano was tuned to 442 Hz instead of 440 Hz. She insists this is DEEPLY troubling.\n\n',
        options: [
            { text: 'Ask why she\'s wearing black', nextScene: 'patricia_black' },
            { text: 'Back to Patricia', nextScene: 'patricia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    patricia_black: {
        text: 'Patricia always wears black on Mondays through Fridays. Today is Wednesday. The significance is unclear but she seems to think it matters. She mentions she was at the house tuning the piano from 2 PM to 6 PM on the day of the murder. She never left, not even for a moment. She also saw Tongyu the gardener wearing an unusual shade of green that clashed with the garden aesthetic.\n\n',
        options: [
            { text: 'Ask about the piano', nextScene: 'patricia_piano' },
            { text: 'Back to Patricia', nextScene: 'patricia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon: {
        text: 'Simon is the accountant. He\'s holding a calculator.\n\n',
        options: [
            { text: 'Ask about finances', nextScene: 'simon_finances' },
            { text: 'Ask about the calculator', nextScene: 'simon_calc' },
            { text: 'Ask about tax season', nextScene: 'simon_tax' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon_finances: {
        text: 'Simon reveals your aunt spent $67.32 more on groceries last month than usual. He calls this a "red flag."\n\n',
        options: [
            { text: 'Ask about the calculator', nextScene: 'simon_calc' },
            { text: 'Ask about tax season', nextScene: 'simon_tax' },
            { text: 'Back to Simon', nextScene: 'simon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon_calc: {
        text: 'The calculator is a TI-84 Plus from 2009. Simon mentions this model was discontinued in 2013, which he finds suspicious. He also saw Felix the watchmaker intensely studying Simon\'s calculations. Felix seemed very interested in the numbers. Simon distinctly remembers this happened at 2:15 PM because he checks his watch obsessively.\n\n',
        options: [
            { text: 'Ask about finances', nextScene: 'simon_finances' },
            { text: 'Ask about tax season', nextScene: 'simon_tax' },
            { text: 'Back to Simon', nextScene: 'simon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon_tax: {
        text: 'Simon states that your aunt filed her taxes 3 days earlier than last year. This "pattern change" seems important to him.\n\n',
        options: [
            { text: 'Ask about finances', nextScene: 'simon_finances' },
            { text: 'Ask about the calculator', nextScene: 'simon_calc' },
            { text: 'Back to Simon', nextScene: 'simon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rachel: {
        text: 'Rachel is the dog walker. There are no dogs at your aunt\'s residence, yet she continues to be employed. She always wears dog hair on her clothes, which is peculiar given her actual job duties. She\'s been paid for this non-existent work for 5 years.\n\n',
        options: [
            { text: 'Ask about the missing dogs', nextScene: 'rachel_dogs' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rachel_dogs: {
        text: 'Rachel explains your aunt never had dogs, but she was hired anyway "just in case." This has been her job for 5 years. She mentions she was walking by the house around 2:00 PM and saw the pool cleaner leaving early, which she found odd. She didn\'t see the mailman at all that day, which was unusual since he\'s always so punctual.\n\n',
        options: [
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    vincent: {
        text: 'Vincent is the antique dealer who supplies rare and valuable items to wealthy clients. He smells like mothballs and has an obsessive attention to detail. His shop is filled with priceless items, and he\'s known for being extremely particular about authentication.\n\n',
        options: [
            { text: 'Ask about recent purchases', nextScene: 'vincent_purchases' },
            { text: 'Ask about the smell', nextScene: 'vincent_smell' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    vincent_purchases: {
        text: 'Vincent sold your aunt a 17th century spoon last month. He emphasizes it was DEFINITELY authentic, which makes you suspicious.\n\n',
        options: [
            { text: 'Back to Vincent', nextScene: 'vincent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    vincent_smell: {
        text: 'Vincent explains he stores all antiques with mothballs. He uses exactly 67 mothballs per item. This precision seems important. He insists he arrived at your aunt\'s house at 9:30 AM on the day of the murder to appraise a new item. He was there until noon, then left directly. He didn\'t see the newspaper delivery person at all.\n\n',
        options: [
            { text: 'Back to Vincent', nextScene: 'vincent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gloria: {
        text: 'Gloria is the librarian from the local library. She\'s meticulous about library procedures and takes her job very seriously. She has an encyclopedic knowledge of all patrons and their borrowing habits, and never forgets a single overdue item.\n\n',
        options: [
            { text: 'Ask about borrowed books', nextScene: 'gloria_books' },
            { text: 'Ask about late fees', nextScene: 'gloria_fees' },
            { text: 'Ask about library hours', nextScene: 'gloria_hours' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gloria_books: {
        text: 'Your aunt checked out "Advanced Knitting Techniques" but never returned it. Gloria seems to think this is a MAJOR clue.\n\n',
        options: [
            { text: 'Back to Gloria', nextScene: 'gloria' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gloria_fees: {
        text: 'The late fee is $0.15 per day. Your aunt owed $4.65. Gloria has calculated this is exactly 31 days overdue.\n\n',
        options: [
            { text: 'Ask about books', nextScene: 'gloria_books' },
            { text: 'Ask about library hours', nextScene: 'gloria_hours' },
            { text: 'Back to Gloria', nextScene: 'gloria' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gloria_hours: {
        text: 'Gloria mentions the library closes at 6 PM on Thursdays but 7 PM on Fridays. Your aunt visited on a Thursday. Surely this means something! Gloria also notes that Patricia the piano tuner returned a book that day at 5:45 PM. She seemed flustered and rushed, completely unlike her usual composed demeanor.\n\n',
        options: [
            { text: 'Ask about books', nextScene: 'gloria_books' },
            { text: 'Ask about late fees', nextScene: 'gloria_fees' },
            { text: 'Back to Gloria', nextScene: 'gloria' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    boris: {
        text: 'Boris is the ice sculptor. His hands are always cold from working with ice, and he has a peculiar habit of obsessively documenting everything he creates. He works in a small studio downtown and has created dozens of sculptures for high society events.\n\n',
        options: [
            { text: 'Ask about recent sculptures', nextScene: 'boris_sculptures' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    boris_sculptures: {
        text: 'Boris made an ice swan for your aunt\'s party 3 months ago. It melted in 4 hours and 23 minutes. He tracked the time meticulously. He mentions Patricia the piano tuner complained the ice was too cold and affected the piano\'s tuning. Boris and Patricia haven\'t spoken since.\n\n',
        options: [
            { text: 'Back to Boris', nextScene: 'boris' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    natasha: {
        text: 'Natasha is the yoga instructor. She\'s standing on one leg, demonstrating perfect balance and control. She holds classes at an exclusive studio and your aunt was one of her most dedicated students for the past two years.\n\n',
        options: [
            { text: 'Ask about yoga classes', nextScene: 'natasha_yoga' },
            { text: 'Ask why she\'s on one leg', nextScene: 'natasha_leg' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    natasha_yoga: {
        text: 'Natasha says your aunt attended classes every third Tuesday. She missed the last one. This "break in routine" seems significant to her.\n\n',
        options: [
            { text: 'Ask why she\'s on one leg', nextScene: 'natasha_leg' },
            { text: 'Back to Natasha', nextScene: 'natasha' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    natasha_leg: {
        text: 'Natasha explains she\'s demonstrating Tree Pose. She can hold it for exactly 17 minutes. She offers to show you. She mentions she once tried to teach Kacper the cook some relaxation techniques, but he was too nervous and kept dropping things.\n\n',
        options: [
            { text: 'Ask about yoga classes', nextScene: 'natasha_yoga' },
            { text: 'Back to Natasha', nextScene: 'natasha' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix: {
        text: 'Felix is the watch repairman. He keeps checking his watch.\n\n',
        options: [
            { text: 'Ask about watch repairs', nextScene: 'felix_repairs' },
            { text: 'Ask about Simon\'s calculations', nextScene: 'felix_simon' },
            { text: 'Ask about the time', nextScene: 'felix_time' },
            { text: 'Ask why he keeps checking', nextScene: 'felix_checking' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_simon: {
        text: 'Felix becomes very nervous. He mentions he saw Simon\'s calculations and realized they matched a time he saw Rachel walking past the house. Rachel, the dog walker with no dogs! The timing was at 3:47 PM, he\'s absolutely certain. Felix is convinced this is the key to everything.\n\n',
        options: [
            { text: 'Ask about watch repairs', nextScene: 'felix_repairs' },
            { text: 'Ask about the time', nextScene: 'felix_time' },
            { text: 'Ask why he keeps checking', nextScene: 'felix_checking' },
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_repairs: {
        text: 'Felix repaired your aunt\'s watch 6 times. Each time it was exactly 2 minutes slow. He finds this pattern "deeply meaningful."\n\n',
        options: [
            { text: 'Ask about Simon\'s calculations', nextScene: 'felix_simon' },
            { text: 'Ask about the time', nextScene: 'felix_time' },
            { text: 'Ask why he keeps checking', nextScene: 'felix_checking' },
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_time: {
        text: 'Felix says it\'s currently 14:37:22. He checks again. Now it\'s 14:37:28. Time keeps passing, he observes gravely.\n\n',
        options: [
            { text: 'Ask about watch repairs', nextScene: 'felix_repairs' },
            { text: 'Ask about Simon\'s calculations', nextScene: 'felix_simon' },
            { text: 'Ask why he keeps checking', nextScene: 'felix_checking' },
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_checking: {
        text: 'Felix checks his watch every 43 seconds. He\'s been doing this for 12 years. He seems to think this is relevant information.\n\n',
        options: [
            { text: 'Ask about watch repairs', nextScene: 'felix_repairs' },
            { text: 'Ask about Simon\'s calculations', nextScene: 'felix_simon' },
            { text: 'Ask about the time', nextScene: 'felix_time' },
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    bethany: {
        text: 'Bethany is the interior decorator. Everything about her is beige.\n\n',
        options: [
            { text: 'Ask about recent decorating', nextScene: 'bethany_decorating' },
            { text: 'Ask about color choices', nextScene: 'bethany_colors' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    bethany_decorating: {
        text: 'Bethany redecorated the guest bathroom 8 months ago. She chose curtains in "Eggshell White #67" instead of "Eggshell White #46." Critical difference.\n\n',
        options: [
            { text: 'Ask about color choices', nextScene: 'bethany_colors' },
            { text: 'Back to Bethany', nextScene: 'bethany' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    bethany_colors: {
        text: 'Bethany explains she only works in neutral tones. Your aunt wanted burgundy once. Bethany refused. This conflict was 4 years ago but still haunts her. She complains that Vincent\'s office has "aggressively offensive" lighting that ruins the beige undertones.\n\n',
        options: [
            { text: 'Ask about recent decorating', nextScene: 'bethany_decorating' },
            { text: 'Back to Bethany', nextScene: 'bethany' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leonard: {
        text: 'Leonard is the electrician. He keeps flipping a light switch that isn\'t connected to anything.\n\n',
        options: [
            { text: 'Ask about electrical work', nextScene: 'leonard_electrical' },
            { text: 'Ask about the switch', nextScene: 'leonard_switch' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leonard_electrical: {
        text: 'Leonard installed a new circuit breaker last year. It handles 200 amps instead of 150. He emphasizes this upgrade MUST be important.\n\n',
        options: [
            { text: 'Ask about the switch', nextScene: 'leonard_switch' },
            { text: 'Back to Leonard', nextScene: 'leonard' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leonard_switch: {
        text: 'Leonard carries this switch everywhere. It\'s from 1987. He flips it 400 times daily for "practice." This seems like a vital detail to him. He whispers that Sophia\'s "perfect handwriting" is obviously traced with a ruler and thus "cheating at penmanship."\n\n',
        options: [
            { text: 'Ask about electrical work', nextScene: 'leonard_electrical' },
            { text: 'Back to Leonard', nextScene: 'leonard' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne: {
        text: 'Yvonne is the newspaper delivery person. She has ink stains on her fingers.\n\n',
        options: [
            { text: 'Ask about newspaper delivery', nextScene: 'yvonne_delivery' },
            { text: 'Ask about the ink stains', nextScene: 'yvonne_ink' },
            { text: 'Ask about headlines', nextScene: 'yvonne_headlines' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne_delivery: {
        text: 'Yvonne delivered papers at 6:17 AM every day for 9 years. One day she was 3 minutes late. It was 2 years ago but she still feels guilty. On the day of the murder, she delivered at exactly 6:17 AM and saw Vincent\'s car already parked outside. She remembers thinking it was odd for him to be there so early.\n\n',
        options: [
            { text: 'Ask about the ink stains', nextScene: 'yvonne_ink' },
            { text: 'Ask about headlines', nextScene: 'yvonne_headlines' },
            { text: 'Back to Yvonne', nextScene: 'yvonne' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne_ink: {
        text: 'The ink stains are from the Tuesday edition specifically. Tuesday ink is different from Wednesday ink, she claims mysteriously. She mentions she once saw Sophia the calligrapher and thought her perfect handwriting was "unnatural." Yvonne prefers the authenticity of newsprint.\n\n',
        options: [
            { text: 'Ask about newspaper delivery', nextScene: 'yvonne_delivery' },
            { text: 'Ask about headlines', nextScene: 'yvonne_headlines' },
            { text: 'Back to Yvonne', nextScene: 'yvonne' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne_headlines: {
        text: 'Yvonne remembers everyp headline from the past month. She recites them all. None seem relevant but she insists they are.\n\n',
        options: [
            { text: 'Ask about newspaper delivery', nextScene: 'yvonne_delivery' },
            { text: 'Ask about the ink stains', nextScene: 'yvonne_ink' },
            { text: 'Back to Yvonne', nextScene: 'yvonne' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    malcolm: {
        text: 'Malcolm is the chess instructor. He\'s moving invisible chess pieces.\n\n',
        options: [
            { text: 'Ask about chess lessons', nextScene: 'malcolm_chess' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    malcolm_chess: {
        text: 'Malcolm taught your aunt the Sicilian Defense. She never mastered it. Malcolm believes this inability is somehow connected to everything. He also mentions that Theodore the locksmith once challenged him to a game. Malcolm won in 4 moves and Theodore has avoided him ever since.\n\n',
        options: [
            { text: 'Back to Malcolm', nextScene: 'malcolm' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    sophia: {
        text: 'Sophia is the calligrapher. Her handwriting is suspiciously perfect.\n\n',
        options: [
            { text: 'Ask about recent work', nextScene: 'sophia_work' },
            { text: 'Ask about her handwriting', nextScene: 'sophia_handwriting' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    sophia_work: {
        text: 'Sophia wrote place cards for a dinner party 5 weeks ago. She used Copperplate script with a 3mm nib. The specificity seems crucial.\n\n',
        options: [
            { text: 'Ask about her handwriting', nextScene: 'sophia_handwriting' },
            { text: 'Back to Sophia', nextScene: 'sophia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    sophia_handwriting: {
        text: 'Sophia explains perfect handwriting takes 10,000 hours of practice. She\'s practiced for exactly 10,867 hours. She\'s been counting. She once saw Tongyu\'s signature and noticed it "lacked the proper ascender height" which she found "deeply unsettling."\n\n',
        options: [
            { text: 'Ask about recent work', nextScene: 'sophia_work' },
            { text: 'Back to Sophia', nextScene: 'sophia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory: {
        text: 'Gregory is the meteorologist. He\'s holding a barometer.\n\n',
        options: [
            { text: 'Ask about the weather', nextScene: 'gregory_weather' },
            { text: 'Ask about the barometer', nextScene: 'gregory_barometer' },
            { text: 'Ask about predictions', nextScene: 'gregory_predictions' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory_weather: {
        text: 'Gregory states it was 67°F on the day of the murder. The humidity was 67%. Wind speed: 3 mph northeast. He insists these numbers matter. He mentions Kacper the critic once complained about "improperly filtered air quality" which Gregory found "meteorologically absurd."\n\n',
        options: [
            { text: 'Ask about the barometer', nextScene: 'gregory_barometer' },
            { text: 'Ask about predictions', nextScene: 'gregory_predictions' },
            { text: 'Back to Gregory', nextScene: 'gregory' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory_barometer: {
        text: 'The barometric pressure was 1013.2 millibars, which is EXACTLY average. Gregory finds this suspicious. Too average, he says.\n\n',
        options: [
            { text: 'Ask about the weather', nextScene: 'gregory_weather' },
            { text: 'Ask about predictions', nextScene: 'gregory_predictions' },
            { text: 'Back to Gregory', nextScene: 'gregory' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory_predictions: {
        text: 'Gregory predicted rain for that day. It didn\'t rain. His first wrong prediction in 3 months. Surely this cosmic imbalance is significant!\n\n',
        options: [
            { text: 'Ask about the weather', nextScene: 'gregory_weather' },
            { text: 'Ask about the barometer', nextScene: 'gregory_barometer' },
            { text: 'Back to Gregory', nextScene: 'gregory' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    heather: {
        text: 'Heather is the personal trainer. She\'s doing lunges while talking.\n\n',
        options: [
            { text: 'Ask about training sessions', nextScene: 'heather_training' },
            { text: 'Ask her to stop lunging', nextScene: 'heather_lunging' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    heather_training: {
        text: 'Heather trained your aunt in high-intensity intervals. 45 seconds work, 15 seconds rest. She chants these numbers repeatedly.\n\n',
        options: [
            { text: 'Ask her to stop lunging', nextScene: 'heather_lunging' },
            { text: 'Back to Heather', nextScene: 'heather' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    heather_lunging: {
        text: 'Heather explains she must do 500 lunges daily. She\'s at 367. She cannot stop. This is clearly the most important information she has. She grunts something about Bethany the decorator being "too sedentary" and needing to "add more movement to beige."\n\n',
        options: [
            { text: 'Ask about training sessions', nextScene: 'heather_training' },
            { text: 'Back to Heather', nextScene: 'heather' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore: {
        text: 'Theodore is the locksmith. He\'s jingling keys constantly.\n\n',
        options: [
            { text: 'Ask about locks', nextScene: 'theodore_locks' },
            { text: 'Ask about the keys', nextScene: 'theodore_keys' },
            { text: 'Ask about security', nextScene: 'theodore_security' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore_locks: {
        text: 'Theodore changed the locks 7 times in 2 years. Your aunt kept losing keys. Each lock was a different brand. He lists all 7 brands.\n\n',
        options: [
            { text: 'Ask about the keys', nextScene: 'theodore_keys' },
            { text: 'Ask about security', nextScene: 'theodore_security' },
            { text: 'Back to Theodore', nextScene: 'theodore' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore_keys: {
        text: 'Theodore has 867 keys on his keychain. He knows what each one opens. He offers to tell you about all of them. He once saw Leonard the waiter meticulously polishing silverware for three hours straight and thought "that man understands commitment to unnecessary precision."\n\n',
        options: [
            { text: 'Ask about locks', nextScene: 'theodore_locks' },
            { text: 'Ask about security', nextScene: 'theodore_security' },
            { text: 'Back to Theodore', nextScene: 'theodore' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore_security: {
        text: 'Theodore installed a deadbolt that\'s rated for 900 pounds of force. The previous one was only 850 pounds. This 50-pound difference haunts him.\n\n',
        options: [
            { text: 'Ask about locks', nextScene: 'theodore_locks' },
            { text: 'Ask about the keys', nextScene: 'theodore_keys' },
            { text: 'Back to Theodore', nextScene: 'theodore' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    millicent: {
        text: 'Millicent is the antique clock collector. You hear ticking from her coat.\n\n',
        options: [
            { text: 'Ask about the clocks', nextScene: 'millicent_clocks' },
            { text: 'Ask about the ticking', nextScene: 'millicent_ticking' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    millicent_clocks: {
        text: 'Millicent sold your aunt 14 antique clocks. Each one chimes at a different interval. She lists all the intervals. None of them seem relevant.\n\n',
        options: [
            { text: 'Ask about the ticking', nextScene: 'millicent_ticking' },
            { text: 'Back to Millicent', nextScene: 'millicent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    millicent_ticking: {
        text: 'Millicent carries 3 pocket watches in her coat. They\'re synchronized to different time zones. She can\'t remember which ones. This must mean something! She mentions that Rayane the accountant has "disgustingly imprecise" timing and once arrived at 3:04 instead of 3:00.\n\n',
        options: [
            { text: 'Ask about the clocks', nextScene: 'millicent_clocks' },
            { text: 'Back to Millicent', nextScene: 'millicent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo: {
        text: 'Leo is just a guy who \'hates everyone. \' For some reason wearing a high-vis vest inside and arguing with Fed-Ex.\n\n',
        options: [
            { text: 'Ask about his work schedule', nextScene: 'leo_schedule' },
            { text: 'Ask about why he\'s so jolly', nextScene: 'leo_jolly' },
            { text: 'Ask about his 11 year old pictures', nextScene: 'leo_pictures' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo_schedule: {
        text: 'Leo works 20 hours a day, 7 days a week. He has 2 hours of sleep, yet somehow maintains his cheerful demeanor. He claims his smile comes from genuine appreciation for life and the people around him. It\'s actually kind of impressive. He once saw Herby the chef frantically driving to three different grocery stores and thought "that guy needs to learn to relax."\n\n',
        options: [
            { text: 'Ask about why he\'s so jolly', nextScene: 'leo_jolly' },
            { text: 'Ask about his 11 year old pictures', nextScene: 'leo_pictures' },
            { text: 'Back to Leo', nextScene: 'leo' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo_jolly: {
        text: 'Leo explains that despite working hard, he finds joy in every moment and tries to spread that positivity to others. He was actually at home on the day of the murder, preparing a nice dinner for some friends. He mentions it was at the same time Dev was out caroling the neighborhood with Christmas spirit.\n\n',
        options: [
            { text: 'Ask about his work schedule', nextScene: 'leo_schedule' },
            { text: 'Ask about his 11 year old pictures', nextScene: 'leo_pictures' },
            { text: 'Back to Leo', nextScene: 'leo' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo_pictures: {
        text: 'Leo deletes all the pictures posted in Slack and threatens to ban you. However, everyone has already downloaded them.\n',
        options: [
            { text: 'Ask about his work schedule', nextScene: 'leo_schedule' },
            { text: 'Ask about why he\'s so jolly', nextScene: 'leo_jolly' },
            { text: 'Back to Leo', nextScene: 'leo' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },

    dev: {
        text: 'Dev is a jolly guy wearing a full Santa suit despite it being January 7th. He\'s thrilled to be interrogated. "Ho Ho Dev!" he exclaims.\n\n',
        options: [
            { text: 'Ask about the Santa suit', nextScene: 'dev_suit' },
            { text: 'Ask about his whereabouts', nextScene: 'dev_whereabouts' },
            { text: 'Ask about his mood', nextScene: 'dev_mood' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    dev_suit: {
        text: 'Dev explains he wears the Santa suit year-round to "spread Christmas spirit!" He\'s been wearing it for 4 consecutive years without washing it. The smell is... notable. He insists Gregory the tailor could "never understand the spiritual bond between Santa and his suit."\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'dev_whereabouts' },
            { text: 'Ask about his mood', nextScene: 'dev_mood' },
            { text: 'Back to Dev', nextScene: 'dev' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    dev_whereabouts: {
        text: 'Dev was visiting every house on the block on the day of the murder, distributing unsolicited Christmas gifts to little children. He visited 67 houses. He remembers the exact order and offers to recite them all. HO HO HO!\n\n',
        options: [
            { text: 'Ask about the Santa suit', nextScene: 'dev_suit' },
            { text: 'Ask about his mood', nextScene: 'dev_mood' },
            { text: 'Back to Dev', nextScene: 'dev' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    dev_mood: {
        text: 'Dev is ALWAYS in a good mood. He was in a good mood the day of the murder. He\'s in a good mood right now, despite being interrogated for murder. He finds this inconsistency between his mood and the tragedy "philosophically confusing." Dev also mentions seeing Leo on his 23rd call of the day and they made eye contact.\n\n',
        options: [
            { text: 'Ask about the Santa suit', nextScene: 'dev_suit' },
            { text: 'Ask about his whereabouts', nextScene: 'dev_whereabouts' },
            { text: 'Back to Dev', nextScene: 'dev' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    ren_ran: {
        text: 'Ren Ran is a happy and excited manager. They\'re practically bouncing in their seat.\n\n',
        options: [
            { text: 'Ask about managerial responsibilities', nextScene: 'ren_ran_manager' },
            { text: 'Ask about excitement levels', nextScene: 'ren_ran_excitement' },
            { text: 'Ask about team morale', nextScene: 'ren_ran_morale' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    ren_ran_manager: {
        text: 'Ren Ran manages a team of 23 people. She knows all their names, their favorite colors, and their preferred fonts. She claims managing these details is the key to productivity, in reality it just makes people too afraid to refuse.\n\n',
        options: [
            { text: 'Back to Ren Ran', nextScene: 'ren_ran' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    ren_ran_excitement: {
        text: 'Ren Ran maintains a constant state of excitement. 0 to 100 excitement, they average 92. The day of the murder they were at 91. This "dip" in excitement seems VERY significant to them.\n\n',
        options: [
            { text: 'Back to Ren Ran', nextScene: 'ren_ran' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    ren_ran_morale: {
        text: 'Ren Ran is obsessed with team morale. They conduct weekly surveys with 68 questions each making sure to avoid 67 to prevent the 1 millisecond of unproductive behavior. The results are displayed on a 15-foot graph in their office. They discuss their methodology exhaustively. They once tried to survey Patricia about her morale and got a death stare that "registered as a -34 on the happiness scale."\n\n',
        options: [
            { text: 'Back to Ren Ran', nextScene: 'ren_ran' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane: {
        text: 'Rayane is a guy who pretends to kknow how to write code, in reality he prompts human intelligence to let him copy and paste. He\'s been frantically pressing command C + command V on his laptop and looks exhausted.\n\n',
        options: [
            { text: 'Ask what he\'s working on', nextScene: 'rayane_project' },
            { text: 'Ask about his whereabouts', nextScene: 'rayane_whereabouts' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane_project: {
        text: 'Rayane excitedly explains he\'s been programming a random text-based game revolving around a murder mystery. He finds it \'hilariously ironic\' given the current circumstances. The game apparently has code into it which is really revolutionizing.\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'rayane_whereabouts' },
            { text: 'Back to Rayane', nextScene: 'rayane' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane_whereabouts: {
        text: 'Rayane says he was in his room coding the entire day. He has GitHub commits timestamped throughout the day as proof. He mentions something about "debugging button animations" and "fixing the accusation logic."\n\n',
        options: [
            { text: 'Ask what he\'s working on', nextScene: 'rayane_project' },
            { text: 'Back to Rayane', nextScene: 'rayane' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    alex: {
        text: 'Alex sits quietly with his hands folded on the table. He looks at you calmly and nods in greeting.\n\n',
        options: [
            { text: 'Ask about his background', nextScene: 'alex_background' },
            { text: 'Ask about his whereabouts', nextScene: 'alex_whereabouts' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    alex_background: {
        text: 'Alex explains he works as an accountant for a small firm downtown. He\'s known your aunt for several years through mutual friends. He speaks in a measured tone, neither overly friendly nor defensive. Just straightforward.\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'alex_whereabouts' },
            { text: 'Back to Alex', nextScene: 'alex' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    alex_whereabouts: {
        text: 'Alex says he spent most of the day in the library reading. He had a few conversations with people there but didn\'t pay much attention to the exact times. When asked about the murder, he simply states he had no reason to harm anyone and hopes the truth comes out soon.\n\n',
        options: [
            { text: 'Ask about his background', nextScene: 'alex_background' },
            { text: 'Back to Alex', nextScene: 'alex' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    reem: {
        text: 'Reem is a courier who never stops moving. She\'s tapping her foot rapidly and checking her watch every few seconds. Before you can even finish your first question she\'s already ordering a halal meal for both of you.\n\n',
        options: [
            { text: 'Ask about her deliveries', nextScene: 'reem_deliveries' },
            { text: 'Ask about her schedule', nextScene: 'reem_schedule' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    reem_deliveries: {
        text: 'Reem talks at lightning speed: "Yes-yes-I-deliver-packages-all-over-town-34-stops-today-record-is-67-your-aunt-got-3-packages-this-week-signed-at-9:47-AM-exactly-always-on-time-never-late-Herby-was-there-too-racing-around-for-salad-stuff-we-almost-crashed-both-laughed-kept-going!" She barely takes a breath.\n\n',
        options: [
            { text: 'Ask about her schedule', nextScene: 'reem_schedule' },
            { text: 'Back to Reem', nextScene: 'reem' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    reem_schedule: {
        text: 'Reem rattles off: "Day-of-murder-started-5-AM-warehouse-sorted-packages-left-5:47-first-stop-6:02-coffee-shop-second-stop-your-aunt-9:47-saw-Marcus-leaving-waved-didn\'t-stop-to-chat-no-time-time-is-money-28-more-stops-finished-7:13-PM-home-8-PM-asleep-8:30!" You\'re exhausted just listening to her.\n\n',
        options: [
            { text: 'Ask about her deliveries', nextScene: 'reem_deliveries' },
            { text: 'Back to Reem', nextScene: 'reem' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    }
    //endregion
};
//endregion SCENES DEFINITION

//region 3. FUNCTIONS

//region 3.1 INITIALIZATION & DISPLAY
function init() {
    outputDiv = document.getElementById('output');
    optionsDiv = document.getElementById('options');
    accuseContainer = document.getElementById('accuseContainer');
    
    // Initialize typewriter sound (will loop while typing)
    typewriterSound = new Audio('assets/typewriter_sfx.mp3');
    typewriterSound.volume = 0.3;
    typewriterSound.loop = true;
    typewriterSound.preload = 'auto';
    
    // Initialize celebration sound
    celebrationSound = new Audio('assets/celebration_sfx.mp3');
    celebrationSound.volume = 0.5;
    
    // Initialize click sound
    clickSound = new Audio('assets/mouse_click_sfx.mp3');
    clickSound.volume = 0.15;
    clickSound.preload = 'auto';
    
    // Initialize click sound
    clickSound = new Audio('assets/mouse_click_sfx.mp3');
    clickSound.volume = 0.15;
    clickSound.preload = 'auto';
    
    // Load saved volumes from localStorage
    loadSettings();
    
    // Initialize notepad functionality
    setupNotepad();
    
    // Initialize notepad formatting tools
    setupNotepadTools();
    
    // Initialize settings functionality
    setupSettings();
    
    // Initialize save slots functionality
    setupSaveSystem();
    
    // Initialize achievements functionality
    setupAchievements();
    
    // Initialize browser functionality
    setupBrowser();
    
    // Initialize progress bar
    setupProgressBar();
    
    // Initialize font size controls
    setupFontSizeControls();
    
    // Try to load saved game
    loadGame();
    
    // Setup auto-save every 1 minute if enabled
    autoSaveInterval = setInterval(() => {
        if (autoSaveEnabled) {
            saveGame(true); // true = silent auto-save
        }
    }, 60000); // 60000ms = 1 minute
    
    // Add click-to-skip typing functionality
    document.addEventListener('click', (e) => {
        // Only skip if clicking on non-interactive elements (not buttons, inputs, etc.)
        const target = e.target;
        const isInteractive = target.tagName === 'BUTTON' || 
                             target.tagName === 'INPUT' || 
                             target.tagName === 'SELECT' ||
                             target.tagName === 'A' ||
                             target.closest('button');
        
        // Skip typing only if currently typing and not clicking on interactive elements
        if (isTyping && !isInteractive) {
            skipTyping();
        }
        
        // Skip button animation if buttons are animating
        if (buttonsAnimating && !isInteractive) {
            skipButtonAnimation();
        }
    });
    
    displayScene();
}

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {}); // Ignore if autoplay blocked
    }
}

function log(text) {
    outputDiv.textContent += text;
}

function clearOutput() {
    resetTyping();
    outputDiv.innerHTML = '';
}

function resetTyping() {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    // Stop sound if typing is interrupted
    stopTypewriterSound();
}

function startTypewriterSound() {
    if (typewriterSound && !isTyping) {
        isTyping = true;
        // Add typing class to grey out the output
        outputDiv.classList.add('typing');
        typewriterSound.currentTime = 0;
        typewriterSound.play().catch(() => {});
    }
}

function stopTypewriterSound() {
    if (typewriterSound && isTyping) {
        isTyping = false;
        // Remove typing class to restore normal appearance
        outputDiv.classList.remove('typing');
        typewriterSound.pause();
        typewriterSound.currentTime = 0;
    }
}

function typeText(text, onComplete) {
    let index = 0;
    currentTypingText = text;
    currentTypingCallback = onComplete;
    
    // Start looping sound when typing begins
    startTypewriterSound();
    
    const typeNext = () => {
        // Check if we're at a span tag for congratulations
        if (text.substring(index).startsWith('<span class="congratulations">')) {
            const endTag = '</span>';
            const endIndex = text.indexOf(endTag, index) + endTag.length;
            outputDiv.innerHTML += text.substring(index, endIndex);
            index = endIndex;
        } else {
            const char = text.charAt(index);
            outputDiv.textContent += char;
            index += 1;
        }
        
        if (index < text.length) {
            typingTimeout = setTimeout(typeNext, TYPE_SPEED);
        } else {
            // Stop sound when typing is complete
            stopTypewriterSound();
            typingTimeout = null;
            currentTypingText = '';
            currentTypingCallback = null;
            if (onComplete) {
                onComplete();
            }
        }
    };
    typeNext();
}

function skipTyping() {
    if (isTyping && currentTypingText) {
        // Cancel ongoing typing
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        
        // Stop sound
        stopTypewriterSound();
        
        // Show full text immediately
        outputDiv.innerHTML = '';
        // Handle HTML tags properly
        if (currentTypingText.includes('<span class="congratulations">')) {
            outputDiv.innerHTML = currentTypingText;
        } else {
            outputDiv.textContent = currentTypingText;
        }
        
        // Call the completion callback
        const callback = currentTypingCallback;
        currentTypingText = '';
        currentTypingCallback = null;
        
        if (callback) {
            callback();
        }
    }
}

function displayScene() {
    const scene = scenes[currentScene];
    resetTyping();
    clearOutput();
    hideOptions();
    
    // Detect character switch and reset dialogue repetitions
    if (currentScene !== 'intro' && currentScene !== 'win' && !currentScene.startsWith('accuse_')) {
        // Extract character name from scene (e.g., "kacper_alibi" -> "kacper")
        const characterName = currentScene.split('_')[0];
        if (currentCharacter && currentCharacter !== characterName) {
            // Switched to a different character, reset dialogue repetitions
            dialogueRepetitions = {};
        }
        currentCharacter = characterName;
    }
    
    // Track dialogue repetitions for non-intro/non-accuse scenes
    if (!currentScene.startsWith('accuse_') && currentScene !== 'intro' && currentScene !== 'win') {
        if (!dialogueRepetitions[currentScene]) {
            dialogueRepetitions[currentScene] = 0;
        }
        dialogueRepetitions[currentScene]++;
    }
    
    // Stop celebration sound when leaving win scene
    if (celebrationSound && !celebrationSound.paused && currentScene !== 'win') {
        celebrationSound.pause();
        celebrationSound.currentTime = 0;
    }
    
    // Auto-save on scene change (except intro) if enabled
    if (currentScene !== 'intro' && autoSaveEnabled) {
        saveGame(true); // true = silent auto-save
    }
    
    // Stop any ongoing speech
    stopSpeaking();
    
    // Track character accusation achievements
    if (currentScene.startsWith('accuse_')) {
        const characterMap = {
            'accuse_marcus': 'Marcus',
            'accuse_tongyu': 'Tongyu',
            'accuse_derek': 'Derek',
            'accuse_kacper': 'Kacper',
            'accuse_patricia': 'Patricia',
            'accuse_simon': 'Simon',
            'accuse_jane': 'Jane',
            'accuse_rachel': 'Rachel',
            'accuse_vincent': 'Vincent',
            'accuse_herby': 'Herby',
            'accuse_gloria': 'Gloria',
            'accuse_boris': 'Boris',
            'accuse_natasha': 'Natasha',
            'accuse_felix': 'Felix',
            'accuse_euan': 'Euan',
            'accuse_bethany': 'Bethany',
            'accuse_leonard': 'Leonard',
            'accuse_yvonne': 'Yvonne',
            'accuse_malcolm': 'Malcolm',
            'accuse_sophia': 'Sophia',
            'accuse_gregory': 'Gregory',
            'accuse_heather': 'Heather',
            'accuse_theodore': 'Theodore',
            'accuse_millicent': 'Millicent',
            'accuse_leo': 'Leo',
            'accuse_dev': 'Dev',
            'accuse_renran': 'Ren Ran',
            'accuse_rayane': 'Rayane',
            'accuse_alex': 'Alex',
            'accuse_reem': 'Reem'
        };
        
        const characterName = characterMap[currentScene];
        if (characterName) {
            unlockAchievement('accuseCharacter', characterName);
        }
    }
    
    let textToType = scene.text;
    
    // Add annoyed responses for repeated dialogue
    const repetitionCount = dialogueRepetitions[currentScene] || 0;
    if (repetitionCount >= 3 && !currentScene.startsWith('accuse_') && currentScene !== 'intro' && currentScene !== 'win') {
        // Define aggressive characters who refuse to answer
        const aggressiveCharacters = ['euan', 'kacper', 'patricia', 'yvonne', 'heather', 'theodore'];
        const isAggressive = aggressiveCharacters.some(char => currentScene.toLowerCase().includes(char));
        
        if (isAggressive) {
            textToType = "\"Are you SERIOUS right now? I already told you this! I'm NOT repeating myself again. Ask me something else!\"\n\n";
        } else if (repetitionCount === 3) {
            textToType = "\"*sighs heavily* ...Fine, I'll tell you AGAIN...\"\n\n" + scene.text.substring(0, Math.floor(scene.text.length * 0.6)) + "...\n\n";
        } else if (repetitionCount === 4) {
            textToType = "\"Seriously? AGAIN?! Okay, short version:\"\n\n" + scene.text.substring(0, Math.floor(scene.text.length * 0.4)) + "... That's all you're getting.\n\n";
        } else {
            textToType = "\"I'M NOT SAYING IT AGAIN.\"\n\n";
        }
    }
    
    // Play celebration sound on win or any accusation scene
    if (currentScene === 'win' || currentScene.startsWith('accuse_')) {
        if (celebrationSound) {
            celebrationSound.currentTime = 0;
            celebrationSound.play();
        }
        // Reset dialogue repetitions when accusing someone
        dialogueRepetitions = {};
    }
    
    if (currentScene === 'intro') {
        if (!welcomeDiv) {
            welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome';
            const welcomeImg = document.createElement('img');
            welcomeImg.src = 'assets/midnight_welcome_image.png';
            welcomeImg.alt = 'WELCOME TO MIDNIGHT';
            welcomeDiv.appendChild(welcomeImg);
            document.body.appendChild(welcomeDiv);
        }
        if (leoPicDiv) {
            document.body.removeChild(leoPicDiv);
            leoPicDiv = null;
        }
        textToType = '\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n';
        showAccuseButton();
    } else if (currentScene === 'leo_pictures') {
        if (!leoPicDiv) {
            leoPicDiv = document.createElement('div');
            leoPicDiv.style.position = 'fixed';
            leoPicDiv.style.top = '80%';
            leoPicDiv.style.left = '50%';
            leoPicDiv.style.transform = 'translate(-50%, -50%)';
            leoPicDiv.style.zIndex = '999';
            leoPicDiv.style.textAlign = 'center';
            leoPicDiv.style.opacity = '0';
            leoPicDiv.style.transition = 'opacity 0.5s ease-in';
            const leoPic = document.createElement('img');
            leoPic.src = 'assets/leo_pics.png';
            leoPic.alt = 'Leo Pictures';
            leoPic.style.maxWidth = '25vw';
            leoPic.style.maxHeight = '25vh';
            leoPic.style.border = '3px solid #fff';
            leoPic.style.boxShadow = '0 10px 40px rgba(0,0,0,0.8)';
            leoPicDiv.appendChild(leoPic);
            document.body.appendChild(leoPicDiv);
            setTimeout(() => {
                leoPicDiv.style.opacity = '1';
            }, 10);
        }
        if (welcomeDiv) {
            document.body.removeChild(welcomeDiv);
            welcomeDiv = null;
        }
        hideAccuseButton();
    } else {
        if (welcomeDiv) {
            document.body.removeChild(welcomeDiv);
            welcomeDiv = null;
        }
        if (leoPicDiv) {
            document.body.removeChild(leoPicDiv);
            leoPicDiv = null;
        }
        hideAccuseButton();
    }
    let options = [...scene.options];
    if (currentScene === 'kacper' && !kacper_cooked) {
        options.splice(2, 0, { text: 'Ask about what he cooked', nextScene: 'kacper_meal' });
    }
    if (currentScene === 'marcus' && !marcus_package_received) {
        options.splice(1, 0, { text: 'Get the mysterious package', nextScene: 'marcus_package' });
    }
    if (currentScene === 'tongyu' && kacper_cooked) {
        options.splice(2, 0, { text: 'Hand her the salad', nextScene: 'tongyu_salad' });
    }
    if (currentScene === 'euan' && tongyu_salad_shared) {
        options.splice(2, 0, { text: 'Ask about his favorite type of salad', nextScene: 'euan_salad' });
    }
    if (currentScene === 'herby' && euan_salad_told) {
        options.splice(2, 0, { text: 'Ask about why he cared about the salad ingredients', nextScene: 'herby_salad_care' });
    }
    
    // Speak the text if TTS is enabled
    speakText(textToType);
    
    typeText(textToType, () => {
        displayOptions(options);
        showOptions();
    });
}

function displayOptions(options) {
    optionsDiv.innerHTML = '';
    currentOptions = options;
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = `[${index + 1}] ${option.text}`;
        button.onclick = () => {
            playClickSound();
            handleOptionSelect(option);
        };
        
        // Check if this scene has been visited
        let shouldGreyOut = false;
        
        if (currentScene === 'intro') {
            // In intro scene: grey out character if all their questions have been visited
            const characterScene = scenes[option.nextScene];
            if (characterScene && characterScene.options) {
                // Get all non-"Back to" options for this character
                const questionOptions = characterScene.options.filter(opt => !opt.text.startsWith('Back to'));
                
                // Add conditional options that might be available
                let conditionalOptions = [];
                if (option.nextScene === 'kacper' && !kacper_cooked) {
                    conditionalOptions.push('kacper_meal');
                }
                if (option.nextScene === 'marcus' && !marcus_package_received) {
                    conditionalOptions.push('marcus_package');
                }
                if (option.nextScene === 'tongyu' && kacper_cooked) {
                    conditionalOptions.push('tongyu_salad');
                }
                if (option.nextScene === 'euan' && tongyu_salad_shared) {
                    conditionalOptions.push('euan_salad');
                }
                if (option.nextScene === 'herby' && euan_salad_told) {
                    conditionalOptions.push('herby_salad_care');
                }
                
                // Check if all question options (including conditional ones) have been visited
                if (questionOptions.length > 0) {
                    const allQuestionsVisited = questionOptions.every(opt => visitedScenes.has(opt.nextScene));
                    const allConditionalVisited = conditionalOptions.every(opt => visitedScenes.has(opt));
                    shouldGreyOut = allQuestionsVisited && allConditionalVisited;
                }
            }
        } else {
            // In other scenes: grey out if visited and not a "Back to" button
            shouldGreyOut = visitedScenes.has(option.nextScene) && !option.text.startsWith('Back to');
        }
        
        if (shouldGreyOut) {
            button.classList.add('visited');
        }
        
        optionsDiv.appendChild(button);
    });
    
    // Apply current font size to newly created buttons
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 18;
    if (savedFontSize !== 18) {
        applyFontSize(savedFontSize);
    }
}

function hideOptions() {
    optionsDiv.classList.add('hidden');
}

function showOptions() {
    buttonsAnimating = true;
    requestAnimationFrame(() => {
        optionsDiv.classList.remove('hidden');
        const buttons = optionsDiv.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.1}s`;
            button.classList.add('fade-in');
        });
        
        // Set timeout to mark animation as complete
        const lastButtonDelay = (buttons.length - 1) * 0.1;
        setTimeout(() => {
            buttonsAnimating = false;
        }, (lastButtonDelay + 0.4) * 1000); // 0.4s is animation duration
    });
}

function skipButtonAnimation() {
    if (buttonsAnimating) {
        const buttons = optionsDiv.querySelectorAll('button');
        buttons.forEach((button) => {
            button.style.animationDelay = '0s';
            button.style.animation = 'none';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        });
        buttonsAnimating = false;
    }
}
//endregion

//region 3.2 EVENT HANDLING & STATE MANAGEMENT
function handleOptionSelect(option) {
    if (option.nextScene === 'restart') {
        restartGame();
        return;
    }
    // Track this scene as visited
    visitedScenes.add(option.nextScene);
    
    // Update progress bar
    updateProgressBar();
    
    // Track accusation achievements
    if (option.nextScene.startsWith('accuse_')) {
        // Extract character name from scene ID
        const sceneToName = {
            'accuse_marcus': 'Marcus',
            'accuse_tongyu': 'Tongyu',
            'accuse_derek': 'Derek',
            'accuse_kacper': 'Kacper',
            'accuse_patricia': 'Patricia',
            'accuse_simon': 'Simon',
            'accuse_jane': 'Jane',
            'accuse_rachel': 'Rachel',
            'accuse_vincent': 'Vincent',
            'accuse_herby': 'Herby',
            'accuse_gloria': 'Gloria',
            'accuse_boris': 'Boris',
            'accuse_natasha': 'Natasha',
            'accuse_felix': 'Felix',
            'accuse_euan': 'Euan',
            'accuse_bethany': 'Bethany',
            'accuse_leonard': 'Leonard',
            'accuse_yvonne': 'Yvonne',
            'accuse_malcolm': 'Malcolm',
            'accuse_sophia': 'Sophia',
            'accuse_gregory': 'Gregory',
            'accuse_heather': 'Heather',
            'accuse_theodore': 'Theodore',
            'accuse_millicent': 'Millicent',
            'accuse_leo': 'Leo',
            'accuse_dev': 'Dev',
            'accuse_renran': 'Ren Ran',
            'accuse_rayane': 'Rayane',
            'accuse_alex': 'Alex',
            'accuse_reem': 'Reem'
        };
        
        const characterName = sceneToName[option.nextScene];
        if (characterName) {
            unlockAchievement('accuseCharacter', characterName);
        }
    }
    
    if (option.nextScene === 'kacper_meal') {
        kacper_cooked = true;
    }
    if (option.nextScene === 'marcus_package') {
        marcus_package_received = true;
    }
    if (option.nextScene === 'tongyu_salad') {
        tongyu_salad_shared = true;
    }
    if (option.nextScene === 'euan_salad') {
        euan_salad_told = true;
    }
    currentScene = option.nextScene;
    displayScene();
}

function showAccuseButton() {
    accuseContainer.innerHTML = '';
    const accuseBtn = document.createElement('button');
    accuseBtn.id = 'accuseBtn';
    accuseBtn.textContent = 'ACCUSE';
    accuseBtn.onclick = () => {
        playClickSound();
        currentScene = 'accuse';
        displayScene();
    };
    accuseContainer.appendChild(accuseBtn);
}

function hideAccuseButton() {
    accuseContainer.innerHTML = '';
}

function restartGame() {
    kacper_cooked = false;
    tongyu_salad_shared = false;
    euan_salad_told = false;
    marcus_package_received = false;
    simon_calculator_seen = false;
    felix_watched = false;
    leo_coffee_known = false;
    visitedScenes.clear();
    currentScene = 'intro';
    displayScene();
}
//endregion

//region 3.3 KEYBOARD CONTROLS
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const num = parseInt(key);
    
    // Number keys for options
    if (num >= 1 && num <= currentOptions.length) {
        const option = currentOptions[num - 1];
        handleOptionSelect(option);
    }
    
    // N key for notepad
    if (key.toLowerCase() === 'n') {
        const notepadContainer = document.getElementById('notepadContainer');
        const notepadText = document.getElementById('notepadText');
        
        // Don't trigger if typing in browser address bar or other inputs (but allow in notepad itself)
        if (event.target.matches('input') && event.target.id !== 'notepadText') {
            return;
        }
        
        if (notepadContainer.style.display === 'block') {
            notepadContainer.style.display = 'none';
        } else {
            notepadContainer.style.display = 'block';
            notepadText.focus();
        }
    }
    
    // M key for settings
    if (key.toLowerCase() === 'm' && !event.target.matches('input, textarea')) {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel.classList.contains('open')) {
            settingsPanel.classList.remove('open');
        } else {
            settingsPanel.classList.add('open');
        }
    }
    
    // + or = key for increasing font size
    if ((key === '+' || key === '=') && !event.target.matches('input, textarea')) {
        const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 18;
        if (savedFontSize < 28) {
            const newSize = savedFontSize + 2;
            applyFontSize(newSize);
            localStorage.setItem('fontSize', newSize);
        }
    }
    
    // - or _ key for decreasing font size
    if ((key === '-' || key === '_') && !event.target.matches('input, textarea')) {
        const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 18;
        if (savedFontSize > 12) {
            const newSize = savedFontSize - 2;
            applyFontSize(newSize);
            localStorage.setItem('fontSize', newSize);
        }
    }
});
//endregion

//region 3.4 NOTEPAD FUNCTIONALITY
function setupNotepad() {
    const notepadBtn = document.getElementById('notepadBtn');
    const notepadContainer = document.getElementById('notepadContainer');
    const notepadClose = document.getElementById('notepadClose');
    const notepadText = document.getElementById('notepadText');
    
    // Load saved notes from localStorage (now uses innerHTML for rich text)
    const savedNotes = localStorage.getItem('detectiveNotes');
    if (savedNotes) {
        notepadText.innerHTML = savedNotes;
    }
    
    // Open notepad
    notepadBtn.addEventListener('click', () => {
        playClickSound();
        notepadContainer.style.display = 'block';
        notepadText.focus();
        unlockAchievement('notepad');
    });
    
    // Close notepad
    notepadClose.addEventListener('click', () => {
        playClickSound();
        notepadContainer.style.display = 'none';
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && notepadContainer.style.display === 'block') {
            notepadContainer.style.display = 'none';
        }
    });
    
    // Save notes automatically as user types (now uses innerHTML for rich text)
    notepadText.addEventListener('input', () => {
        localStorage.setItem('detectiveNotes', notepadText.innerHTML);
    });
    
    // Prevent keyboard shortcuts from triggering game controls when typing
    notepadText.addEventListener('keydown', (event) => {
        event.stopPropagation();
    });
    
    // Setup notepad formatting tools
    setupNotepadTools();
}
//endregion

//region SAVE SLOTS SYSTEM
function setupSaveSystem() {
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const savePanel = document.getElementById('savePanel');
    const loadPanel = document.getElementById('loadPanel');
    const savePanelClose = document.getElementById('savePanelClose');
    const loadPanelClose = document.getElementById('loadPanelClose');
    
    // Open Save Panel
    saveBtn.addEventListener('click', () => {
        playClickSound();
        document.getElementById('settingsPanel').classList.remove('open');
        renderSaveSlots();
        savePanel.classList.add('open');
    });
    
    // Open Load Panel
    loadBtn.addEventListener('click', () => {
        playClickSound();
        document.getElementById('settingsPanel').classList.remove('open');
        renderLoadSlots();
        loadPanel.classList.add('open');
    });
    
    // Close Save Panel
    savePanelClose.addEventListener('click', () => {
        playClickSound();
        savePanel.classList.remove('open');
    });
    
    // Close Load Panel
    loadPanelClose.addEventListener('click', () => {
        playClickSound();
        loadPanel.classList.remove('open');
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            savePanel.classList.remove('open');
            loadPanel.classList.remove('open');
        }
    });
}

function renderSaveSlots() {
    const container = document.getElementById('saveSlotsList');
    container.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const slotContainer = document.createElement('div');
        slotContainer.style.cssText = 'display: flex; gap: 8px; width: 100%;';
        
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.type = 'button';
        btn.style.flex = '1';
        const saveData = localStorage.getItem(`saveSlot_${i}`);
        
        if (saveData) {
            try {
                const save = JSON.parse(saveData);
                const date = new Date(save.saveDate);
                const progress = save.visitedScenes ? save.visitedScenes.length : 0;
                const achievements = save.achievementCount || 0;
                btn.innerHTML = `<div class="slot-name">💾 Slot ${i}</div><div class="slot-info">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div><div class="slot-info">👥 ${progress}/30 characters • 🏆 ${achievements}/34 achievements</div>`;
                
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'slot-delete-btn';
                deleteBtn.type = 'button';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.title = 'Delete this save';
                const slotNum = i;
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm(`Delete Slot ${slotNum}?`)) {
                        playClickSound();
                        localStorage.removeItem(`saveSlot_${slotNum}`);
                        renderSaveSlots();
                        showNotification(`Slot ${slotNum} deleted`, '#ff4444');
                    }
                });
                slotContainer.appendChild(deleteBtn);
            } catch (e) {
                btn.innerHTML = `<div class="slot-name">📭 Slot ${i}</div><div class="slot-info">Empty</div>`;
                btn.classList.add('empty');
            }
        } else {
            btn.innerHTML = `<div class="slot-name">📭 Slot ${i}</div><div class="slot-info">Empty</div>`;
            btn.classList.add('empty');
        }
        
        const slotNum = i;
        btn.addEventListener('click', function() {
            playClickSound();
            saveToSlot(slotNum);
        });
        
        slotContainer.insertBefore(btn, slotContainer.firstChild);
        container.appendChild(slotContainer);
    }
}

function renderLoadSlots() {
    const container = document.getElementById('loadSlotsList');
    container.innerHTML = '';
    
    // Auto-save slot
    const autoSaveData = localStorage.getItem('gameState');
    const autoBtn = document.createElement('button');
    autoBtn.className = 'slot-btn';
    autoBtn.type = 'button';
    
    if (autoSaveData) {
        try {
            const save = JSON.parse(autoSaveData);
            const progress = save.visitedScenes ? save.visitedScenes.length : 0;
            const achievements = save.achievementCount || 0;
            autoBtn.innerHTML = `<div class="slot-name">⚡ Auto-Save</div><div class="slot-info">👥 ${progress}/30 characters • 🏆 ${achievements}/34 achievements</div>`;
            autoBtn.addEventListener('click', function() {
                playClickSound();
                loadFromSlot(null);
            });
        } catch (e) {
            autoBtn.innerHTML = `<div class="slot-name">⚡ Auto-Save</div><div class="slot-info">No auto-save</div>`;
            autoBtn.classList.add('empty');
            autoBtn.disabled = true;
        }
    } else {
        autoBtn.innerHTML = `<div class="slot-name">⚡ Auto-Save</div><div class="slot-info">No auto-save</div>`;
        autoBtn.classList.add('empty');
        autoBtn.disabled = true;
    }
    container.appendChild(autoBtn);
    
    // Manual save slots
    for (let i = 1; i <= 5; i++) {
        const slotContainer = document.createElement('div');
        slotContainer.style.cssText = 'display: flex; gap: 8px; width: 100%;';
        
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.type = 'button';
        btn.style.flex = '1';
        const saveData = localStorage.getItem(`saveSlot_${i}`);
        
        if (saveData) {
            try {
                const save = JSON.parse(saveData);
                const date = new Date(save.saveDate);
                const progress = save.visitedScenes ? save.visitedScenes.length : 0;
                const achievements = save.achievementCount || 0;
                btn.innerHTML = `<div class="slot-name">💾 Slot ${i}</div><div class="slot-info">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div><div class="slot-info">👥 ${progress}/30 characters • 🏆 ${achievements}/34 achievements</div>`;
                const slotNum = i;
                btn.addEventListener('click', function() {
                    playClickSound();
                    loadFromSlot(slotNum);
                });
                
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'slot-delete-btn';
                deleteBtn.type = 'button';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.title = 'Delete this save';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm(`Delete Slot ${slotNum}?`)) {
                        playClickSound();
                        localStorage.removeItem(`saveSlot_${slotNum}`);
                        renderLoadSlots();
                        showNotification(`Slot ${slotNum} deleted`, '#ff4444');
                    }
                });
                slotContainer.appendChild(deleteBtn);
            } catch (e) {
                btn.innerHTML = `<div class="slot-name">📭 Slot ${i}</div><div class="slot-info">Empty</div>`;
                btn.classList.add('empty');
                btn.disabled = true;
            }
        } else {
            btn.innerHTML = `<div class="slot-name">📭 Slot ${i}</div><div class="slot-info">Empty</div>`;
            btn.classList.add('empty');
            btn.disabled = true;
        }
        
        slotContainer.insertBefore(btn, slotContainer.firstChild);
        container.appendChild(slotContainer);
    }
}


function saveToSlot(slotNumber) {
    saveGame(false, slotNumber);
    renderSaveSlots();
    showNotification(`✓ Saved to Slot ${slotNumber}!`, '#48c774');
}

function loadFromSlot(slotNumber) {
    loadGame(slotNumber);
    document.getElementById('loadPanel').classList.remove('open');
    showNotification(slotNumber ? `✓ Loaded Slot ${slotNumber}!` : '✓ Loaded Auto-Save!', '#667eea');
}

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color};
        color: #fff;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 16px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        font-family: 'PT Sans', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2000);
}
//endregion

//region 3.5 SETTINGS FUNCTIONALITY
function setupSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsClose = document.getElementById('settingsClose');
    const sfxVolumeSlider = document.getElementById('sfxVolume');
    const sfxVolumeValue = document.getElementById('sfxVolumeValue');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    
    // Open settings
    settingsBtn.addEventListener('click', () => {
        playClickSound();
        settingsPanel.classList.add('open');
    });
    
    // Close settings
    settingsClose.addEventListener('click', () => {
        playClickSound();
        settingsPanel.classList.remove('open');
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && settingsPanel.classList.contains('open')) {
            settingsPanel.classList.remove('open');
        }
    });
    
    // SFX volume control
    sfxVolumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100;
        typewriterSound.volume = volume * 0.6; // Typewriter slightly quieter
        celebrationSound.volume = volume;
        clickSound.volume = volume * 0.3; // Click very soft
        sfxVolumeValue.textContent = event.target.value + '%';
        localStorage.setItem('sfxVolume', event.target.value);
    });
    
    // Reset game button
    resetGameBtn.addEventListener('click', () => {
        playClickSound();
        if (confirm('Are you sure you want to reset the game? This will delete your save and start fresh.')) {
            resetGame();
            resetGameBtn.textContent = '✓ Game Reset!';
            setTimeout(() => {
                resetGameBtn.textContent = '🔄 Reset Game';
                settingsPanel.classList.remove('open');
            }, 1000);
        }
    });
    
    // Auto-save toggle
    if (autoSaveToggle) {
        autoSaveToggle.addEventListener('change', () => {
            autoSaveEnabled = autoSaveToggle.checked;
            localStorage.setItem('autoSaveEnabled', autoSaveEnabled);
        });
    }
}

function loadSettings() {
    // Load SFX volume
    const savedSfxVolume = localStorage.getItem('sfxVolume');
    const sfxVolumeSlider = document.getElementById('sfxVolume');
    const sfxVolumeValue = document.getElementById('sfxVolumeValue');
    if (savedSfxVolume !== null) {
        const volume = parseInt(savedSfxVolume) / 100;
        typewriterSound.volume = volume * 0.6;
        celebrationSound.volume = volume;
        clickSound.volume = volume * 0.3;
        if (sfxVolumeSlider) sfxVolumeSlider.value = savedSfxVolume;
        if (sfxVolumeValue) sfxVolumeValue.textContent = savedSfxVolume + '%';
    } else {
        // Default 50%
        typewriterSound.volume = 0.3;
        celebrationSound.volume = 0.5;
        clickSound.volume = 0.15;
    }
    
    // Load OpenDyslexic font setting
    const dyslexicFontEnabled = localStorage.getItem('dyslexicFont') === 'true';
    const dyslexicToggle = document.getElementById('dyslexicFontToggle');
    if (dyslexicToggle) {
        dyslexicToggle.checked = dyslexicFontEnabled;
        if (dyslexicFontEnabled) {
            document.body.classList.add('dyslexic-font');
        }
        
        // Add toggle handler
        dyslexicToggle.addEventListener('change', () => {
            if (dyslexicToggle.checked) {
                document.body.classList.add('dyslexic-font');
                localStorage.setItem('dyslexicFont', 'true');
            } else {
                document.body.classList.remove('dyslexic-font');
                localStorage.setItem('dyslexicFont', 'false');
            }
        });
    }
    
    // Load auto-save setting
    const savedAutoSave = localStorage.getItem('autoSaveEnabled');
    autoSaveEnabled = savedAutoSave !== 'false'; // Default to true
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    if (autoSaveToggle) {
        autoSaveToggle.checked = autoSaveEnabled;
    }
    
    // Setup Text-to-Speech
    setupTextToSpeech();
}

function setupAchievements() {
    const achievementsBtn = document.getElementById('achievementsBtn');
    const achievementsPanel = document.getElementById('achievementsPanel');
    const achievementsClose = document.getElementById('achievementsCloseBtn');
    
    // Toggle achievements
    achievementsBtn.addEventListener('click', () => {
        playClickSound();
        if (achievementsPanel.classList.contains('open')) {
            achievementsPanel.classList.remove('open');
        } else {
            achievementsPanel.classList.add('open');
            renderAchievements();
        }
    });
    
    // Close achievements
    if (achievementsClose) {
        achievementsClose.addEventListener('click', () => {
            playClickSound();
            achievementsPanel.classList.remove('open');
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && achievementsPanel.classList.contains('open')) {
            achievementsPanel.classList.remove('open');
        }
    });
    
    // Load achievements from localStorage
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
        try {
            achievements = JSON.parse(savedAchievements);
        } catch (e) {
            console.error('Failed to load achievements:', e);
        }
    }
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    let html = '';
    
    // Special achievements
    const specialAchievements = [
        {
            id: 'openedNotepad',
            icon: '📝',
            name: 'Note Taker',
            desc: 'Open the notepad',
            unlocked: achievements.openedNotepad
        },
        {
            id: 'openedBrowser',
            icon: '🌐',
            name: 'Cyber Sleuth',
            desc: 'Open the browser',
            unlocked: achievements.openedBrowser
        },
        {
            id: 'completedProgressBar',
            icon: '⭐',
            name: 'Social Butterfly',
            desc: 'Talk to all 30 characters',
            unlocked: achievements.completedProgressBar
        },
        {
            id: 'accusedAllCharacters',
            icon: '🎯',
            name: 'Trial and Error',
            desc: 'Accuse every single character at least once',
            unlocked: achievements.accusedAllCharacters
        }
    ];
    
    // Add special achievements
    specialAchievements.forEach(ach => {
        const unlockedClass = ach.unlocked ? 'unlocked' : '';
        html += `
            <div class="achievement ${unlockedClass}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${ach.name}</div>
                    <div class="achievement-desc">${ach.desc}</div>
                </div>
            </div>
        `;
    });
    
    // Character accusation achievements
    html += '<div style="margin-top: 20px; font-weight: bold; font-size: 18px;">Character Accusations:</div>';
    CHARACTER_NAMES.forEach(name => {
        const unlocked = achievements.accused[name] || false;
        const unlockedClass = unlocked ? 'unlocked' : '';
        html += `
            <div class="achievement ${unlockedClass}">
                <div class="achievement-icon">🔍</div>
                <div class="achievement-info">
                    <div class="achievement-name">Accused ${name}</div>
                    <div class="achievement-desc ${unlocked ? '' : 'achievement-locked'}">
                        ${unlocked ? `You accused ${name}` : 'Not yet accused'}
                    </div>
                </div>
            </div>
        `;
    });
    
    achievementsList.innerHTML = html;
    
    // Calculate and display unlock count
    let totalUnlocked = 0;
    if (achievements.openedNotepad) totalUnlocked++;
    if (achievements.openedBrowser) totalUnlocked++;
    if (achievements.completedProgressBar) totalUnlocked++;
    if (achievements.accusedAllCharacters) totalUnlocked++;
    totalUnlocked += Object.keys(achievements.accused).length;
    
    const total = 34; // 4 special + 30 character accusations
    document.getElementById('achievementsTitle').textContent = `Achievements (${totalUnlocked}/${total})`;
}

function unlockAchievement(type, characterName = null) {
    let unlocked = false;
    let message = '';
    
    if (type === 'notepad' && !achievements.openedNotepad) {
        achievements.openedNotepad = true;
        unlocked = true;
        message = '🏆 Achievement Unlocked: Note Taker!';
    } else if (type === 'browser' && !achievements.openedBrowser) {
        achievements.openedBrowser = true;
        unlocked = true;
        message = '🏆 Achievement Unlocked: Cyber Sleuth!';
    } else if (type === 'progressBar' && !achievements.completedProgressBar) {
        achievements.completedProgressBar = true;
        unlocked = true;
        message = '🏆 Achievement Unlocked: Social Butterfly!';
    } else if (type === 'accuseCharacter' && characterName) {
        if (!achievements.accused[characterName]) {
            achievements.accused[characterName] = true;
            unlocked = true;
            message = `🏆 Achievement Unlocked: Accused ${characterName}!`;
            
            // Check if all characters have been accused
            if (Object.keys(achievements.accused).length === 30 && !achievements.accusedAllCharacters) {
                achievements.accusedAllCharacters = true;
                setTimeout(() => {
                    showAchievementNotification('🏆 Achievement Unlocked: Trial and Error!');
                }, 2000);
            }
        }
    }
    
    if (unlocked) {
        // Save achievements
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Show notification
        showAchievementNotification(message);
    }
}

function showAchievementNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #000;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
        z-index: 10000;
        animation: slideInLeft 0.5s ease-out;
        font-family: 'PT Sans', sans-serif;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from {
                transform: translateX(-400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutLeft {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(-400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 4000);
}

function countUnlockedAchievements() {
    let count = 0;
    if (achievements.openedNotepad) count++;
    if (achievements.openedBrowser) count++;
    if (achievements.completedProgressBar) count++;
    if (achievements.accusedAllCharacters) count++;
    // Count character accusations
    Object.keys(achievements.accused || {}).forEach(char => {
        if (achievements.accused[char]) count++;
    });
    return count;
}

function saveGame(silent = false, slotNumber = null) {
    const gameState = {
        currentScene: currentScene,
        kacper_cooked: kacper_cooked,
        tongyu_salad_shared: tongyu_salad_shared,
        euan_salad_told: euan_salad_told,
        marcus_package_received: marcus_package_received,
        simon_calculator_seen: simon_calculator_seen,
        felix_watched: felix_watched,
        leo_coffee_known: leo_coffee_known,
        visitedScenes: Array.from(visitedScenes),
        dialogueRepetitions: dialogueRepetitions,
        achievementCount: countUnlockedAchievements(),
        saveDate: new Date().toISOString()
    };
    
    if (slotNumber !== null) {
        localStorage.setItem(`saveSlot_${slotNumber}`, JSON.stringify(gameState));
    } else {
        // Auto-save or legacy save
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
    
    if (!silent) {
        console.log('Game saved!' + (slotNumber !== null ? ` (Slot ${slotNumber})` : ''));
    }
}

function loadGame(slotNumber = null) {
    const key = slotNumber !== null ? `saveSlot_${slotNumber}` : 'gameState';
    const savedState = localStorage.getItem(key);
    if (savedState) {
        try {
            const gameState = JSON.parse(savedState);
            currentScene = gameState.currentScene;
            kacper_cooked = gameState.kacper_cooked;
            tongyu_salad_shared = gameState.tongyu_salad_shared;
            euan_salad_told = gameState.euan_salad_told;
            marcus_package_received = gameState.marcus_package_received;
            simon_calculator_seen = gameState.simon_calculator_seen;
            felix_watched = gameState.felix_watched;
            leo_coffee_known = gameState.leo_coffee_known;
            visitedScenes = new Set(gameState.visitedScenes || []);
            dialogueRepetitions = gameState.dialogueRepetitions || {};
            
            // Update progress bar after loading
            updateProgressBar();
            
            // Display the loaded scene
            displayScene();
            
            console.log('Game loaded!' + (slotNumber !== null ? ` (Slot ${slotNumber})` : ''));
        } catch (e) {
            console.error('Failed to load game:', e);
        }
    }
}

function resetGame() {
    // Clear all game state
    localStorage.removeItem('gameState');
    localStorage.removeItem('detectiveNotes');
    localStorage.removeItem('achievements');
    
    // Reset variables
    currentScene = 'intro';
    kacper_cooked = false;
    tongyu_salad_shared = false;
    euan_salad_told = false;
    marcus_package_received = false;
    simon_calculator_seen = false;
    felix_watched = false;
    leo_coffee_known = false;
    visitedScenes = new Set();
    dialogueRepetitions = {};
    
    // Reset achievements
    achievements = {
        openedNotepad: false,
        openedBrowser: false,
        completedProgressBar: false,
        accusedAllCharacters: false,
        accused: {}
    };
    
    // Clear notepad (now a contenteditable div, not textarea)
    document.getElementById('notepadText').innerHTML = '';
    
    // Reset progress bar
    updateProgressBar();
    
    // Restart game
    displayScene();
    console.log('Game reset!');
}
//endregion

//region BROWSER ENGINE
function setupBrowser() {
    const browserBtn = document.getElementById('browserBtn');
    const browserContainer = document.getElementById('browserContainer');
    const browserClose = document.getElementById('browserClose');
    const browserBack = document.getElementById('browserBack');
    const browserForward = document.getElementById('browserForward');
    const browserAddress = document.getElementById('browserAddress');
    const browserGo = document.getElementById('browserGo');
    const browserContent = document.getElementById('browserContent');
    
    let history = [];
    let historyIndex = -1;
    
    const websites = {
        'financial-records.com': `
            <div class="web-page">
                <h1>Estate Financial Records - Confidential</h1>
                <p><strong>Account Holder:</strong> Your Aunt's Estate</p>
                <p><strong>Last Updated:</strong> Day of Murder</p>
                
                <h2>Recent Transactions</h2>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Authorized By</th>
                    </tr>
                    <tr>
                        <td>3 days ago</td>
                        <td>Garden Supplies</td>
                        <td>$450</td>
                        <td>Tongyu (Gardener)</td>
                    </tr>
                    <tr>
                        <td>3 days ago</td>
                        <td>Pool Maintenance</td>
                        <td>$320</td>
                        <td>Derek (Pool Cleaner)</td>
                    </tr>
                    <tr class="suspicious">
                        <td>2 days ago</td>
                        <td>Wire Transfer - Offshore Account</td>
                        <td>$15,000</td>
                        <td>Euan (Accountant)</td>
                    </tr>
                    <tr>
                        <td>1 day ago</td>
                        <td>Flower Delivery</td>
                        <td>$85</td>
                        <td>Olivia (Florist)</td>
                    </tr>
                    <tr class="suspicious">
                        <td>Day of murder</td>
                        <td>Emergency Cash Withdrawal</td>
                        <td>$5,000</td>
                        <td>Simon (Accountant)</td>
                    </tr>
                    <tr class="suspicious">
                        <td>Day of murder</td>
                        <td>Wire Transfer - Unknown Recipient</td>
                        <td>$8,500</td>
                        <td>Euan (Accountant)</td>
                    </tr>
                </table>
                
                <h2>Suspicious Activity Notes</h2>
                <p style="color: #d32f2f; font-weight: bold;">⚠️ Multiple unauthorized transactions detected</p>
                <p>Independent audit scheduled for tomorrow has been cancelled due to circumstances.</p>
                <p>Last login: Euan - 11:47 PM (Night before murder)</p>
            </div>
        `,
        
        'midnight-game.com': `
            <div class="web-page">
                <h1>MIDNIGHT - A Murder Mystery Game</h1>
                <p style="font-style: italic; color: #666;">By Rayane - Game Developer</p>
                
                <div class="game-frame">
                    <h3>🎮 Game Description</h3>
                    <p>Welcome to MIDNIGHT, a text-based murder mystery where YOU are the detective!</p>
                    <p>Your aunt has been murdered, and you must interrogate 30 suspects to find the killer.</p>
                    <p><strong>Features:</strong></p>
                    <ul>
                        <li>30 unique characters with distinct personalities</li>
                        <li>Typewriter text effect for immersive storytelling</li>
                        <li>Contradicting testimonies to solve</li>
                        <li>Multiple possible endings - YOU decide who's guilty!</li>
                        <li>Detective notepad to track your clues</li>
                    </ul>
                </div>
                
                <h2>Developer Notes</h2>
                <p><em>"This game is just insanely ironic. Started coding it a few days ago, then I ended up being in a real murder investigation!"</em></p>
                
                <h2>Recent Commits</h2>
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Day of murder - 9:15 AM</td>
                        <td>Added character: Alex (calm accountant)</td>
                    </tr>
                    <tr>
                        <td>Day of murder - 11:30 AM</td>
                        <td>Fixed button animations</td>
                    </tr>
                    <tr>
                        <td>Day of murder - 2:45 PM</td>
                        <td>Debugging accusation logic</td>
                    </tr>
                    <tr>
                        <td>Day of murder - 4:00 PM</td>
                        <td>Added celebration sound effect</td>
                    </tr>
                </table>
                
                <p style="margin-top: 20px;"><strong>Play Now:</strong> <a href="#">Actually, you're already playing it! Meta, right?</a></p>
            </div>
        `,
        
        'library-catalog.com': `
            <div class="web-page">
                <h1>📚 Public Library - Book Catalog</h1>
                <p>Managed by Gloria (Head Librarian)</p>
                
                <h2>Overdue Books Report</h2>
                <table>
                    <tr>
                        <th>Borrower</th>
                        <th>Book Title</th>
                        <th>Days Overdue</th>
                    </tr>
                    <tr class="suspicious">
                        <td>Euan</td>
                        <td>"Offshore Banking for Beginners"</td>
                        <td>45 days</td>
                    </tr>
                    <tr class="suspicious">
                        <td>Euan</td>
                        <td>"How to Disappear Completely"</td>
                        <td>32 days</td>
                    </tr>
                    <tr class="suspicious">
                        <td>Euan</td>
                        <td>"Financial Fraud Investigation Methods"</td>
                        <td>28 days</td>
                    </tr>
                    <tr>
                        <td>Vincent</td>
                        <td>"Antique Appraisal Guide"</td>
                        <td>12 days</td>
                    </tr>
                    <tr>
                        <td>Malcolm</td>
                        <td>"Advanced Chess Strategies"</td>
                        <td>8 days</td>
                    </tr>
                </table>
                
                <h2>Recent Checkouts (Day of Murder)</h2>
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Borrower</th>
                        <th>Book Title</th>
                    </tr>
                    <tr>
                        <td>10:30 AM</td>
                        <td>Alex</td>
                        <td>"Modern Accounting Practices"</td>
                    </tr>
                    <tr>
                        <td>11:15 AM</td>
                        <td>Jane</td>
                        <td>"Coping with Loss"</td>
                    </tr>
                    <tr>
                        <td>2:00 PM</td>
                        <td>Alex</td>
                        <td>Returned "Modern Accounting Practices"</td>
                    </tr>
                </table>
                
                <p style="font-style: italic; margin-top: 20px;">Note from Gloria: "Some people really need to return their books on time. It's just RUDE!"</p>
            </div>
        `,
        
        'weather-archive.com': `
            <div class="web-page">
                <h1>🌤️ Weather Archive</h1>
                <p>Meteorological Data by Gregory</p>
                
                <h2>Weather Report - Day of Murder</h2>
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Condition</th>
                        <th>Temperature</th>
                        <th>Precipitation</th>
                    </tr>
                    <tr>
                        <td>9:00 AM</td>
                        <td>☀️ Sunny & Clear</td>
                        <td>75°F</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>12:00 PM</td>
                        <td>☀️ Sunny & Clear</td>
                        <td>78°F</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>3:00 PM</td>
                        <td>☀️ Cloudless</td>
                        <td>80°F</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>6:00 PM</td>
                        <td>🌅 Clear Evening</td>
                        <td>72°F</td>
                        <td>0%</td>
                    </tr>
                </table>
                
                <p style="margin-top: 20px; padding: 15px; background: #ffe6e6; border-left: 4px solid #d32f2f;">
                    <strong>⚠️ DISCREPANCY ALERT:</strong><br>
                    Marcus the mailman reported "heavy rain" during his 3:47 PM delivery.<br>
                    Weather data shows ZERO precipitation all day.<br>
                    <em>Someone is lying about the weather...</em>
                </p>
                
                <h2>Barometric Pressure</h2>
                <p>Steady at 30.12 inHg all day - Perfect conditions, no atmospheric disturbances</p>
            </div>
        `,
        
        'news-daily.com': `
            <div class="web-page">
                <h1>📰 The Daily Chronicle</h1>
                <p style="font-style: italic;">Editor: Yvonne (Investigative Journalist)</p>
                
                <h2>BREAKING: Local Estate Owner Found Dead</h2>
                <p><strong>Published:</strong> Day After Murder</p>
                <p>A prominent estate owner was found dead yesterday under mysterious circumstances. Police have questioned multiple suspects but no arrests have been made.</p>
                
                <h2>Recent Articles by Yvonne</h2>
                <ul>
                    <li><a href="#">"Local Accountant Under Investigation for Embezzlement" - Published 3 days before murder (REMOVED)</a></li>
                    <li><a href="#">"Garden Nursery Accused of Selling Rare Endangered Plants" - 1 week ago</a></li>
                    <li><a href="#">"Pool Maintenance Scam Uncovered" - 2 weeks ago</a></li>
                </ul>
                
                <p style="margin-top: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107;">
                    <strong>Editor's Note:</strong> The article about accountant embezzlement was removed pending legal review. 
                    The subject of the article has not been publicly named.
                </p>
                
                <h2>Classified Ads</h2>
                <p><em>"Urgent: Seeking one-way ticket to non-extradition country. Discretion required."</em> - Posted anonymously 2 days before murder</p>
            </div>
        `
    };
    
    function loadHomepage() {
        browserContent.innerHTML = `
            <div class="web-page">
                <h1>🌐 WebExplorer Home</h1>
                <p style="text-align: center; color: #666; margin-bottom: 30px;">Browse available websites to gather evidence</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                    <div class="website-widget" onclick="loadBrowserPage('financial-records.com')" style="cursor: pointer; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="margin: 0 0 10px 0; color: white;">💰 Financial Records</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Estate financial data and suspicious transactions</p>
                    </div>
                    
                    <div class="website-widget" onclick="loadBrowserPage('midnight-game.com')" style="cursor: pointer; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="margin: 0 0 10px 0; color: white;">🎮 Midnight Game</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Rayane's murder mystery game and commit history</p>
                    </div>
                    
                    <div class="website-widget" onclick="loadBrowserPage('library-catalog.com')" style="cursor: pointer; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="margin: 0 0 10px 0; color: white;">📚 Library Catalog</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Book checkout records and overdue items</p>
                    </div>
                    
                    <div class="website-widget" onclick="loadBrowserPage('weather-archive.com')" style="cursor: pointer; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="margin: 0 0 10px 0; color: white;">🌤️ Weather Archive</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Meteorological data and weather reports</p>
                    </div>
                    
                    <div class="website-widget" onclick="loadBrowserPage('news-daily.com')" style="cursor: pointer; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="margin: 0 0 10px 0; color: white;">📰 News Daily</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Local news articles and investigations</p>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 14px;">💡 Tip: Click any widget to visit that website</p>
                </div>
            </div>
        `;
        browserAddress.value = 'home';
        
        // Add to history
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push('home');
        historyIndex++;
        updateNavButtons();
    }
    
    function loadPage(url) {
        playClickSound();
        if (url === 'home') {
            loadHomepage();
        } else if (websites[url]) {
            browserContent.innerHTML = websites[url];
            browserAddress.value = url;
            
            // Add to history
            if (historyIndex < history.length - 1) {
                history = history.slice(0, historyIndex + 1);
            }
            history.push(url);
            historyIndex++;
            
            updateNavButtons();
        } else {
            loadHomepage();
        }
    }
    
    function updateNavButtons() {
        browserBack.disabled = historyIndex <= 0;
        browserForward.disabled = historyIndex >= history.length - 1;
        browserBack.style.opacity = historyIndex <= 0 ? '0.5' : '1';
        browserForward.style.opacity = historyIndex >= history.length - 1 ? '0.5' : '1';
    }
    
    // Make loadPage accessible globally for inline links
    window.loadBrowserPage = loadPage;
    
    // Open browser
    browserBtn.addEventListener('click', () => {
        playClickSound();
        browserContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (history.length === 0) {
            loadHomepage();
        }
        unlockAchievement('browser');
    });
    
    // Close browser
    browserClose.addEventListener('click', () => {
        playClickSound();
        browserContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Back button
    browserBack.addEventListener('click', () => {
        playClickSound();
        if (historyIndex > 0) {
            historyIndex--;
            const url = history[historyIndex];
            if (url === 'home') {
                loadHomepage();
            } else {
                browserContent.innerHTML = websites[url];
                browserAddress.value = url;
            }
            updateNavButtons();
        }
    });
    
    // Forward button
    browserForward.addEventListener('click', () => {
        playClickSound();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            const url = history[historyIndex];
            if (url === 'home') {
                loadHomepage();
            } else {
                browserContent.innerHTML = websites[url];
                browserAddress.value = url;
            }
            updateNavButtons();
        }
    });
    
    // Go button
    browserGo.addEventListener('click', () => {
        playClickSound();
        loadPage(browserAddress.value);
    });
    
    // Enter key in address bar
    browserAddress.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadPage(browserAddress.value);
        }
    });
    
    // ESC to close
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && browserContainer.style.display === 'flex') {
            browserContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}
//endregion

//region PROGRESS BAR
function setupProgressBar() {
    updateProgressBar();
}

function updateProgressBar() {
    const progressCount = document.getElementById('progressCount');
    const progressFill = document.getElementById('progressFill');
    
    // Count unique character scenes visited (excluding intro, accuse, restart, etc.)
    const characterScenes = new Set([
        'marcus', 'tongyu', 'derek', 'kacper', 'patricia', 'simon', 'jane',
        'rachel', 'vincent', 'herby', 'gloria', 'boris', 'natasha', 'felix', 'euan',
        'bethany', 'leonard', 'yvonne', 'malcolm', 'sophia', 'gregory', 'heather',
        'theodore', 'millicent', 'leo', 'dev', 'ren_ran', 'rayane', 'alex', 'reem'
    ]);
    
    const questioned = Array.from(visitedScenes).filter(scene => characterScenes.has(scene));
    const count = questioned.length;
    const total = 30;
    const percentage = (count / total) * 100;
    
    progressCount.textContent = `${count}/${total}`;
    progressFill.style.width = `${percentage}%`;
    
    // Check if all characters questioned
    if (count === 30) {
        unlockAchievement('progressBar');
    }
}
//endregion

//region FONT SIZE CONTROLS
function setupFontSizeControls() {
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    const body = document.body;
    
    // Load saved font size
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 18;
    applyFontSize(currentFontSize);
    
    fontIncrease.addEventListener('click', () => {
        playClickSound();
        if (currentFontSize < 28) {
            currentFontSize += 2;
            applyFontSize(currentFontSize);
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
    
    fontDecrease.addEventListener('click', () => {
        playClickSound();
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            applyFontSize(currentFontSize);
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
}

function applyFontSize(size) {
    document.body.style.fontSize = size + 'px';
    
    // Update all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.fontSize = size + 'px';
    });
}

// Notepad formatting toggle states
let boldActive = false;
let highlightActive = false;

function toggleBold() {
    const boldBtn = document.getElementById('boldBtn');
    const notepad = document.getElementById('notepadText');
    
    // Execute bold command - this works on selection or toggles for future input
    notepad.focus();
    document.execCommand('bold', false, null);
    
    // Check if we're now in bold mode by querying the state
    boldActive = document.queryCommandState('bold');
    
    if (boldActive) {
        boldBtn.classList.add('active');
    } else {
        boldBtn.classList.remove('active');
    }
    
    saveNotepadContent();
}

function toggleHighlight() {
    const highlightBtn = document.getElementById('highlightBtn');
    const notepad = document.getElementById('notepadText');
    
    notepad.focus();
    
    // Toggle highlight state
    highlightActive = !highlightActive;
    
    if (highlightActive) {
        highlightBtn.classList.add('active');
        document.execCommand('backColor', false, '#FFFF00');
    } else {
        highlightBtn.classList.remove('active');
        // Remove highlight - use white/transparent
        document.execCommand('backColor', false, '#FFF8DC');
    }
    
    saveNotepadContent();
}

// Update button states based on cursor position
function updateToolbarState() {
    const boldBtn = document.getElementById('boldBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    
    // Check bold state
    boldActive = document.queryCommandState('bold');
    if (boldActive) {
        boldBtn.classList.add('active');
    } else {
        boldBtn.classList.remove('active');
    }
    
    // Check highlight state by looking at backColor
    const backColor = document.queryCommandValue('backColor');
    if (backColor === 'rgb(255, 255, 0)' || backColor === '#FFFF00' || backColor === 'yellow') {
        highlightActive = true;
        highlightBtn.classList.add('active');
    } else {
        highlightActive = false;
        highlightBtn.classList.remove('active');
    }
}

function saveNotepadContent() {
    const notepad = document.getElementById('notepadText');
    localStorage.setItem('detectiveNotes', notepad.innerHTML);
}

function setupNotepadTools() {
    const boldBtn = document.getElementById('boldBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    const notepad = document.getElementById('notepadText');
    
    // Bold button click
    boldBtn.onclick = function(e) {
        e.preventDefault();
        notepad.focus();
        document.execCommand('bold', false, null);
        
        // Update button state
        if (document.queryCommandState('bold')) {
            boldBtn.classList.add('active');
        } else {
            boldBtn.classList.remove('active');
        }
        saveNotepadContent();
    };
    
    // Highlight button click
    highlightBtn.onclick = function(e) {
        e.preventDefault();
        notepad.focus();
        
        // Check current highlight state
        const backColor = document.queryCommandValue('backColor');
        const isHighlighted = backColor === 'rgb(255, 255, 0)' || backColor === '#FFFF00' || backColor === 'yellow';
        
        if (isHighlighted) {
            document.execCommand('backColor', false, '#FFF8DC');
            highlightBtn.classList.remove('active');
        } else {
            document.execCommand('backColor', false, '#FFFF00');
            highlightBtn.classList.add('active');
        }
        saveNotepadContent();
    };
    
    // Update toolbar state when selection changes or cursor moves
    notepad.addEventListener('mouseup', updateToolbarState);
    notepad.addEventListener('keyup', updateToolbarState);
    
    // Save content on input
    notepad.addEventListener('input', () => {
        saveNotepadContent();
    });
    
    // Load saved content
    const savedNotes = localStorage.getItem('detectiveNotes');
    if (savedNotes) {
        notepad.innerHTML = savedNotes;
    }
}
//endregion

//region TEXT-TO-SPEECH
let ttsEnabled = false;
let ttsVoice = null;
let ttsSpeed = 1.0;
let ttsVolume = 1.0;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;

function setupTextToSpeech() {
    const ttsToggle = document.getElementById('ttsToggle');
    const ttsVoiceSection = document.getElementById('ttsVoiceSection');
    const ttsSpeedSection = document.getElementById('ttsSpeedSection');
    const ttsVolumeSection = document.getElementById('ttsVolumeSection');
    const ttsVoiceSelect = document.getElementById('ttsVoiceSelect');
    const ttsSpeedSlider = document.getElementById('ttsSpeed');
    const ttsSpeedValue = document.getElementById('ttsSpeedValue');
    const ttsVolumeSlider = document.getElementById('ttsVolume');
    const ttsVolumeValue = document.getElementById('ttsVolumeValue');
    
    if (!ttsToggle || !speechSynth) return;
    
    // Load saved TTS settings
    ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
    ttsToggle.checked = ttsEnabled;
    
    const savedSpeed = localStorage.getItem('ttsSpeed');
    if (savedSpeed) {
        ttsSpeed = parseFloat(savedSpeed);
        ttsSpeedSlider.value = ttsSpeed * 10;
        ttsSpeedValue.textContent = ttsSpeed.toFixed(1) + 'x';
    }
    
    const savedVolume = localStorage.getItem('ttsVolume');
    if (savedVolume) {
        ttsVolume = parseFloat(savedVolume);
        ttsVolumeSlider.value = ttsVolume * 100;
        ttsVolumeValue.textContent = Math.round(ttsVolume * 100) + '%';
    }
    
    // Show/hide TTS options based on toggle
    if (ttsEnabled) {
        ttsVoiceSection.style.display = 'block';
        ttsSpeedSection.style.display = 'block';
        ttsVolumeSection.style.display = 'block';
    }
    
    // Flag to prevent multiple voice population
    let voicesPopulated = false;
    
    // Populate voice list - all English voices
    function populateVoices() {
        const voices = speechSynth.getVoices();
        if (voices.length === 0) return; // Wait for voices to load
        if (voicesPopulated) return; // Only populate once
        
        voicesPopulated = true;
        ttsVoiceSelect.innerHTML = '';
        
        // Filter for English voices
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        const voicesToUse = englishVoices.length > 0 ? englishVoices : voices;
        
        voicesToUse.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = voice.name + ' (' + voice.lang + ')';
            ttsVoiceSelect.appendChild(option);
        });
        
        // Store voices for later use
        ttsVoiceSelect.voices = voicesToUse;
        
        // Load saved voice
        const savedVoice = localStorage.getItem('ttsVoice');
        if (savedVoice && voicesToUse[parseInt(savedVoice)]) {
            ttsVoiceSelect.value = savedVoice;
            ttsVoice = voicesToUse[parseInt(savedVoice)];
        } else if (voicesToUse.length > 0) {
            ttsVoice = voicesToUse[0];
        }
    }
    
    // Voices may load asynchronously
    populateVoices();
    if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = populateVoices;
    }
    
    // TTS toggle handler
    ttsToggle.addEventListener('change', () => {
        ttsEnabled = ttsToggle.checked;
        localStorage.setItem('ttsEnabled', ttsEnabled);
        
        if (ttsEnabled) {
            ttsVoiceSection.style.display = 'block';
            ttsSpeedSection.style.display = 'block';
            ttsVolumeSection.style.display = 'block';
        } else {
            ttsVoiceSection.style.display = 'none';
            ttsSpeedSection.style.display = 'none';
            ttsVolumeSection.style.display = 'none';
            stopSpeaking();
        }
    });
    
    // Voice selection handler
    ttsVoiceSelect.addEventListener('change', () => {
        const voices = ttsVoiceSelect.voices;
        if (voices && voices[ttsVoiceSelect.value]) {
            ttsVoice = voices[ttsVoiceSelect.value];
            localStorage.setItem('ttsVoice', ttsVoiceSelect.value);
        }
    });
    
    // Speed slider handler
    ttsSpeedSlider.addEventListener('input', () => {
        ttsSpeed = ttsSpeedSlider.value / 10;
        ttsSpeedValue.textContent = ttsSpeed.toFixed(1) + 'x';
        localStorage.setItem('ttsSpeed', ttsSpeed);
    });
    
    // Volume slider handler
    ttsVolumeSlider.addEventListener('input', () => {
        ttsVolume = ttsVolumeSlider.value / 100;
        ttsVolumeValue.textContent = Math.round(ttsVolume * 100) + '%';
        localStorage.setItem('ttsVolume', ttsVolume);
    });
}

function speakText(text) {
    if (!ttsEnabled || !speechSynth) return;
    
    // Stop any current speech
    stopSpeaking();
    
    // Clean text for speech
    const cleanText = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\*\*/g, '')    // Remove bold markers
        .replace(/==/g, '')      // Remove highlight markers
        .replace(/\n\n/g, '. ')  // Convert double newlines to pauses
        .replace(/\n/g, ' ')     // Convert single newlines to spaces
        .replace(/\s+/g, ' ')    // Collapse multiple spaces
        .trim();
    
    if (!cleanText) return;
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.rate = ttsSpeed;
    currentUtterance.pitch = 1;
    currentUtterance.volume = ttsVolume;
    
    if (ttsVoice) {
        currentUtterance.voice = ttsVoice;
    }
    
    speechSynth.speak(currentUtterance);
}

function stopSpeaking() {
    if (speechSynth) {
        speechSynth.cancel();
    }
    currentUtterance = null;
}
//endregion

//endregion FUNCTIONS



window.onload = init;