//================================================================================
// MURDER MYSTERY IN A DARK ROOM - Game Script
//================================================================================
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
let currentOptions = [];
let typingTimeout;
const TYPE_SPEED = 12;
let typewriterSound;
let celebrationSound;
let isTyping = false;

// Game state variables
let kacper_cooked = false;
let tongyu_salad_shared = false;
let euan_salad_told = false;
let marcus_package_received = false;
let olivia_orchids_mentioned = false;
let simon_calculator_seen = false;
let felix_watched = false;
let leo_coffee_known = false;

// Track visited scenes
let visitedScenes = new Set();
//endregion

//region 2. SCENES DEFINITION
const scenes = {
    //region Intro Scene
    intro: {
        text: '════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n                                                           WELCOME TO MIDNIGHT\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n',
        options: [
            { text: 'Marcus', nextScene: 'marcus' },
            { text: 'Tongyu', nextScene: 'tongyu' },
            { text: 'Olivia', nextScene: 'olivia' },
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
            { text: 'Rayane', nextScene: 'rayane' }
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
        text: 'Kacper says he was in the kitchen all day preparing dinner.\n\n',
        options: [
            { text: 'Ask about the murder weapon', nextScene: 'kacper_weapon' },
            { text: 'Back to Kacper', nextScene: 'kacper' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    kacper_weapon: {
        text: 'Kacper claims he doesn\'t know anything about the knife found at the scene.\n\n',
        options: [
            { text: 'Ask about his alibi', nextScene: 'kacper_alibi' },
            { text: 'Back to Kacper', nextScene: 'kacper' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    kacper_meal: {
        text: 'Kacper gives you the salad he cooked.\n\n',
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
        text: 'Tongyu is the gardener. She\'s been with the family for years.\n\n',
        options: [
            { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
            { text: 'Ask about suspicious activity', nextScene: 'tongyu_activity' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        tongyu_garden: {
            text: 'Tongyu says the garden is doing good and that the plants are growing well.\n\n',
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
        text: 'Herby is the chaffeur. He looks worried.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'herby_car' },
            { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
            { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
        herby_car: {
            text: 'Herby says the car is a deluxe supreme Apple iCar Pro 17+ with an orange colored exterior.\n\n',
            options: [
                { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
                { text: 'Ask about why he cared about the salad ingredients', nextScene: 'herby_salad_care' },
                { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_whereabouts: {
            text: 'Herby claims he drove the car to get the ingredients for the salad.\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about why he cared about the salad ingredients', nextScene: 'herby_salad_care' }, 
                { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_healer: {
            text: 'Herby says he wanted to be a healer, but the LORE did not allow it.\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
                { text: 'Ask about why he cared about the salad ingredients', nextScene: 'herby_salad_care' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
        herby_salad_care: {
            text: 'Herby says that Euan was pressuring him to get them as fast as possible.\n\n',
            options: [
                { text: 'Ask about the car', nextScene: 'herby_car' },
                { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts'},
                { text: 'Ask why he\'s not a healer', nextScene: 'herby_healer' },
                { text: 'Back to Herby', nextScene: 'herby' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        }
    ,
    //endregion
    //region Euan Scenes
    euan: {
        text: 'Euan is the salesman. He\'s very formal and composed.\n\n',
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
            text: 'Euan looks at you straight in the eyes as if he was staring into your soul and says: \"A depressed crow.\"\n\n',
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
            { text: 'Marcus', nextScene: 'gameover' },
            { text: 'Tongyu', nextScene: 'gameover' },
            { text: 'Olivia', nextScene: 'gameover' },
            { text: 'Derek', nextScene: 'gameover' },
            { text: 'Kacper', nextScene: 'gameover' },
            { text: 'Patricia', nextScene: 'gameover' },
            { text: 'Simon', nextScene: 'gameover' },
            { text: 'Jane', nextScene: 'gameover' },
            { text: 'Rachel', nextScene: 'gameover' },
            { text: 'Vincent', nextScene: 'gameover' },
            { text: 'Herby', nextScene: 'gameover' },
            { text: 'Gloria', nextScene: 'gameover' },
            { text: 'Boris', nextScene: 'gameover' },
            { text: 'Natasha', nextScene: 'gameover' },
            { text: 'Felix', nextScene: 'gameover' },
            { text: 'Euan', nextScene: 'win' },
            { text: 'Bethany', nextScene: 'gameover' },
            { text: 'Leonard', nextScene: 'gameover' },
            { text: 'Yvonne', nextScene: 'gameover' },
            { text: 'Malcolm', nextScene: 'gameover' },
            { text: 'Sophia', nextScene: 'gameover' },
            { text: 'Gregory', nextScene: 'gameover' },
            { text: 'Heather', nextScene: 'gameover' },
            { text: 'Theodore', nextScene: 'gameover' },
            { text: 'Millicent', nextScene: 'gameover' },
            { text: 'Leo', nextScene: 'gameover' },
            { text: 'Dev', nextScene: 'gameover' },
            { text: 'Ren Ran', nextScene: 'gameover' },
            { text: 'Rayane', nextScene: 'bonus' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    win: {
        text: '<span class="congratulations">Congratulations!</span>\n\nYou correctly identified Euan as the murderer.\n\nEuan confesses that he killed your aunt, because, she discovered he was embezzling money from the household accounts. He tried to frame the new cook, Kacper, and Herby, but your detective skills uncovered the truth.\n\nCHARACTER REACTIONS:\n\nKacper: "I KNEW it wasn\'t me! Though I still think my salad was perfect despite the rush."\n\nHerby: "Thank goodness! I was so worried you\'d think I was involved because of the salad ingredient rush. My driving record is clean!"\n\nMarcus: "I delivered that package at exactly 3:47 PM as always. Punctuality saved me from suspicion!"\n\nTongyu: "The garden knew something was wrong that day. Plants can sense evil, you know."\n\nPatricia: "I should have known. The piano was 2 Hz off because of the negative energy in the house."\n\nRachel: "Even without dogs to walk, I knew something was suspicious about Euan\'s timing!"\n\nVincent: "My antiques are sensitive to murderous intent. I should have warned your aunt."\n\nGloria: "Euan had 3 overdue library books! That should have been the first clue to his criminal nature."\n\nBoris: "Ice sculptures melt, but justice freezes the guilty in place. Poetic."\n\nNatasha: "Euan never came to yoga class. A relaxed person would never commit murder."\n\nDerek: "The pool chemicals were off that day. Murder disrupts the pH balance of the universe!"\n\nSimon: "The financial discrepancies were there all along! The numbers never lie."\n\nJane: "I can\'t believe my friend was killed by that awful man. Justice has been served."\n\nFelix: "I checked my watch at the exact moment of the murder. 2 minutes slow, as always."\n\nOlivia: "Those purple orchids I delivered... they were meant to be a warning. Flowers know."\n\nBethany: "Murder is the most non-neutral color of all. Definitely not beige."\n\nLeonard: "I should polish my switch 401 times today to celebrate justice. One extra for luck."\n\nYvonne: "I\'ll make sure this makes the headline: \'Salesman Sentenced!\' Tuesday ink is best for justice."\n\nMalcolm: "Euan never learned proper chess strategy. Checkmate, you embezzling fool."\n\nSophia: "I\'ll write his confession in my most disappointing handwriting. He doesn\'t deserve Copperplate."\n\nGregory: "The barometric pressure dropped when he confessed. Even the weather condemns him!"\n\nHeather: "I\'m doing 500 justice lunges tonight! 368... 369... 370..."\n\nTheodore: "I\'ll change all the locks now. Key number 868 will be specifically for keeping Euan OUT."\n\nMillicent: "All 23 of my clocks struck the hour when justice was served. Perfectly synchronized."\n\nLeo: "Even with all the darkness of murder, I\'m just glad the truth came to light! Stay positive!"\n\nDev: "HO HO HO! Santa\'s list just got one name added to the VERY naughty section!"\n\nRen Ran: "Team morale just jumped from 91 to 98! Justice is EXCELLENT for workplace happiness!"\n\nRayane: "This would make an excellent plot twist for my game. Mind if I use this?"\n\nCASE CLOSED!',
        options: []
    },
    gameover: {
        text: 'GAME OVER!\n\nYou accused the wrong person. The real murderer, got away and fled the country.\n\nYour aunt\'s death remains officially unsolved.',
        options: [
            { text: 'Restart', nextScene: 'restart' }
        ]
    },
    bonus: {
        text: 'Why you chosing me man? I\'m innocent!',
        options: [
            { text: 'Restart', nextScene: 'restart' }
        ]
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
        text: 'Marcus insists he delivered mail at exactly 3:47 PM every Tuesday for the past 3 years. This seems VERY specific.\n\n',
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
    olivia: {
        text: 'Olivia is the florist who delivered flowers weekly.\n\n',
        options: [
            { text: 'Ask about the last flower delivery', nextScene: 'olivia_flowers' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    olivia_flowers: {
        text: 'Olivia says she delivered purple orchids on the day of the murder. Your aunt HATED purple. This must mean something!\n\n',
        options: [
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
            { text: 'Back to Derek', nextScene: 'derek' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek_tan: {
        text: 'Derek explains his tan comes from working outdoors. He specifically mentions it was sunny on alternating Thursdays.\n\n',
        options: [
            { text: 'Back to Derek', nextScene: 'derek' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    derek_water: {
        text: 'The pool water was exactly 2.7 inches lower than regulation. Derek seems to think this is a CRUCIAL detail.\n\n',
        options: [
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
            { text: 'Back to Patricia', nextScene: 'patricia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    patricia_black: {
        text: 'Patricia always wears black on Mondays through Fridays. Today is Wednesday. The significance is unclear but she seems to think it matters. She mentions she once saw the gardener, Tongyu, wearing an unusual shade of green. Patricia thought it clashed with the garden aesthetic.\n\n',
        options: [
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
            { text: 'Back to Simon', nextScene: 'simon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon_calc: {
        text: 'The calculator is a TI-84 Plus from 2009. Simon mentions this model was discontinued in 2013, which he finds suspicious. He also mentions he saw Felix the watchmaker intensely studying Simon\'s calculator calculations. Felix seemed very interested in the numbers.\n\n',
        options: [
            { text: 'Back to Simon', nextScene: 'simon' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    simon_tax: {
        text: 'Simon states that your aunt filed her taxes 3 days earlier than last year. This "pattern change" seems important to him.\n\n',
        options: [
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
        text: 'Rachel explains your aunt never had dogs, but she was hired anyway "just in case." This has been her job for 5 years. She mentions she often saw Herby the chauffeur driving around frantically. She also noticed the mailman Marcus was always exactly on time, which she found "creepy."\n\n',
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
        text: 'Vincent explains he stores all antiques with mothballs. He uses exactly 67 mothballs per item. This precision seems important.\n\n',
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
            { text: 'Back to Gloria', nextScene: 'gloria' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gloria_hours: {
        text: 'Gloria mentions the library closes at 6 PM on Thursdays but 7 PM on Fridays. Your aunt visited on a Thursday. Surely this means something! Gloria also notes that Euan the salesman once returned a book 2 minutes before closing. She found his punctuality "unnerving."\n\n',
        options: [
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
            { text: 'Back to Natasha', nextScene: 'natasha' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    natasha_leg: {
        text: 'Natasha explains she\'s demonstrating Tree Pose. She can hold it for exactly 17 minutes. She offers to show you. She mentions she once tried to teach Kacper the cook some relaxation techniques, but he was too nervous and kept dropping things.\n\n',
        options: [
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
        text: 'Felix becomes very nervous. He mentions he saw Simon\'s calculations and realized they matched a time he saw Rachel walking past the house. Rachel, the dog walker with no dogs! The timing was EXACTLY 2 minutes off from his watch. Felix is convinced this is the key to everything.\n\n',
        options: [
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_repairs: {
        text: 'Felix repaired your aunt\'s watch 6 times. Each time it was exactly 2 minutes slow. He finds this pattern "deeply meaningful."\n\n',
        options: [
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_time: {
        text: 'Felix says it\'s currently 14:37:22. He checks again. Now it\'s 14:37:28. Time keeps passing, he observes gravely.\n\n',
        options: [
            { text: 'Back to Felix', nextScene: 'felix' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    felix_checking: {
        text: 'Felix checks his watch every 43 seconds. He\'s been doing this for 12 years. He seems to think this is relevant information.\n\n',
        options: [
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
            { text: 'Back to Bethany', nextScene: 'bethany' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    bethany_colors: {
        text: 'Bethany explains she only works in neutral tones. Your aunt wanted burgundy once. Bethany refused. This conflict was 4 years ago but still haunts her. She complains that Vincent\'s office has "aggressively offensive" lighting that ruins the beige undertones.\n\n',
        options: [
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
            { text: 'Back to Leonard', nextScene: 'leonard' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leonard_switch: {
        text: 'Leonard carries this switch everywhere. It\'s from 1987. He flips it 400 times daily for "practice." This seems like a vital detail to him. He whispers that Sophia\'s "perfect handwriting" is obviously traced with a ruler and thus "cheating at penmanship."\n\n',
        options: [
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
        text: 'Yvonne delivered papers at 6:17 AM every day for 9 years. One day she was 3 minutes late. It was 2 years ago but she still feels guilty.\n\n',
        options: [
            { text: 'Back to Yvonne', nextScene: 'yvonne' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne_ink: {
        text: 'The ink stains are from the Tuesday edition specifically. Tuesday ink is different from Wednesday ink, she claims mysteriously. She mentions she once saw Sophia the calligrapher and thought her perfect handwriting was "unnatural." Yvonne prefers the authenticity of newsprint.\n\n',
        options: [
            { text: 'Back to Yvonne', nextScene: 'yvonne' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    yvonne_headlines: {
        text: 'Yvonne remembers everyp headline from the past month. She recites them all. None seem relevant but she insists they are.\n\n',
        options: [
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
            { text: 'Back to Sophia', nextScene: 'sophia' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    sophia_handwriting: {
        text: 'Sophia explains perfect handwriting takes 10,000 hours of practice. She\'s practiced for exactly 10,867 hours. She\'s been counting. She once saw Tongyu\'s signature and noticed it "lacked the proper ascender height" which she found "deeply unsettling."\n\n',
        options: [
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
        text: 'Gregory states it was 68°F on the day of the murder. The humidity was 67%. Wind speed: 3 mph northeast. He insists these numbers matter. He mentions Kacper the critic once complained about "improperly filtered air quality" which Gregory found "meteorologically absurd."\n\n',
        options: [
            { text: 'Back to Gregory', nextScene: 'gregory' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory_barometer: {
        text: 'The barometric pressure was 1013.2 millibars, which is EXACTLY average. Gregory finds this suspicious. Too average, he says.\n\n',
        options: [
            { text: 'Back to Gregory', nextScene: 'gregory' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    gregory_predictions: {
        text: 'Gregory predicted rain for that day. It didn\'t rain. His first wrong prediction in 3 months. Surely this cosmic imbalance is significant!\n\n',
        options: [
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
            { text: 'Back to Heather', nextScene: 'heather' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    heather_lunging: {
        text: 'Heather explains she must do 500 lunges daily. She\'s at 367. She cannot stop. This is clearly the most important information she has. She grunts something about Bethany the decorator being "too sedentary" and needing to "add more movement to beige."\n\n',
        options: [
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
            { text: 'Back to Theodore', nextScene: 'theodore' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore_keys: {
        text: 'Theodore has 867 keys on his keychain. He knows what each one opens. He offers to tell you about all of them. He once saw Leonard the waiter meticulously polishing silverware for three hours straight and thought "that man understands commitment to unnecessary precision."\n\n',
        options: [
            { text: 'Back to Theodore', nextScene: 'theodore' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    theodore_security: {
        text: 'Theodore installed a deadbolt that\'s rated for 900 pounds of force. The previous one was only 850 pounds. This 50-pound difference haunts him.\n\n',
        options: [
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
            { text: 'Back to Millicent', nextScene: 'millicent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    millicent_ticking: {
        text: 'Millicent carries 3 pocket watches in her coat. They\'re synchronized to different time zones. She can\'t remember which ones. This must mean something! She mentions that Rayane the accountant has "disgustingly imprecise" timing and once arrived at 3:04 instead of 3:00.\n\n',
        options: [
            { text: 'Back to Millicent', nextScene: 'millicent' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo: {
        text: 'Leo is an extremely hard worked guy who somehow seems jolly all the time. He\'s grinning ear to ear and maintains a surprisingly positive energy.\n\n',
        options: [
            { text: 'Ask about his work schedule', nextScene: 'leo_schedule' },
            { text: 'Ask about why he\'s so jolly', nextScene: 'leo_jolly' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo_schedule: {
        text: 'Leo works 16 hours a day, 6 days a week. He has 2 hours of sleep, yet somehow maintains his cheerful demeanor. He claims his smile comes from genuine appreciation for life and the people around him. It\'s actually kind of impressive. He once saw Herby the chef frantically driving to three different grocery stores and thought "that guy needs to learn to relax."\n\n',
        options: [
            { text: 'Back to Leo', nextScene: 'leo' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    leo_jolly: {
        text: 'Leo explains that despite working hard, he finds joy in every moment and tries to spread that positivity to others. He was actually at home on the day of the murder, preparing a nice dinner for some friends. He mentions it was at the same time Dev was out caroling the neighborhood with Christmas spirit.\n\n',
        options: [
            { text: 'Back to Leo', nextScene: 'leo' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },

    dev: {
        text: 'Dev is a jolly guy wearing a full Santa suit despite it being January 5th. He\'s thrilled to be interrogated. "Ho Ho Dev!" he exclaims.\n\n',
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
            { text: 'Back to Dev', nextScene: 'dev' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    dev_whereabouts: {
        text: 'Dev was visiting every house on the block on the day of the murder, distributing unsolicited Christmas caroling. He visited 67 houses. He remembers the exact order and offers to recite them all. HO HO HO!\n\n',
        options: [
            { text: 'Back to Dev', nextScene: 'dev' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    dev_mood: {
        text: 'Dev is ALWAYS in a good mood. He was in a good mood the day of the murder. He\'s in a good mood right now, despite being interrogated for murder. He finds this inconsistency between his mood and the tragedy "philosophically confusing." Dev also mentions seeing Leo on his 23rd call of the day and they made eye contact.\n\n',
        options: [
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
        text: 'Ren Ran manages a team of 23 people. They know all their names, their favorite colors, and their preferred fonts. They claim managing these details is TIME-CONSUMING but they do it JOYFULLY.\n\n',
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
        text: 'Ren Ran is obsessed with team morale. They conduct weekly surveys with 67 questions each. The results are displayed on a 15-foot graph in their office. They discuss their methodology exhaustively. They once tried to survey Patricia about her morale and got a death stare that "registered as a -34 on the happiness scale."\n\n',
        options: [
            { text: 'Back to Ren Ran', nextScene: 'ren_ran' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane: {
        text: 'Rayane is a programmer. He\'s been frantically typing on his laptop and looks exhausted.\n\n',
        options: [
            { text: 'Ask what he\'s working on', nextScene: 'rayane_project' },
            { text: 'Ask about his whereabouts', nextScene: 'rayane_whereabouts' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane_project: {
        text: 'Rayane excitedly explains he\'s been programming a random text-based game revolving around a murder mystery. He finds it "hilariously ironic" given the current circumstances. The game apparently has suspects, clues, and even a typewriter effect for the text. He\'s been working on it non-stop. He notes that Marcus the mailman would probably appreciate the "systematic organization" of his code.\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'rayane_whereabouts' },
            { text: 'Back to Rayane', nextScene: 'rayane' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    rayane_whereabouts: {
        text: 'Rayane says he was in his room coding the entire day. He has Git commits timestamped throughout the day as proof. He mentions something about "debugging button animations" and "fixing the accusation logic."\n\n',
        options: [
            { text: 'Ask what he\'s working on', nextScene: 'rayane_project' },
            { text: 'Back to Rayane', nextScene: 'rayane' },
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
    
    displayScene();
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
            if (onComplete) {
                onComplete();
            }
        }
    };
    typeNext();
}

function displayScene() {
    const scene = scenes[currentScene];
    resetTyping();
    clearOutput();
    hideOptions();
    let textToType = scene.text;
    
    // Play celebration sound on win
    if (currentScene === 'win') {
        if (celebrationSound) {
            celebrationSound.currentTime = 0;
            celebrationSound.play();
        }
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
        textToType = '\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n';
        showAccuseButton();
    } else {
        if (welcomeDiv) {
            document.body.removeChild(welcomeDiv);
            welcomeDiv = null;
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
}

function hideOptions() {
    optionsDiv.classList.add('hidden');
}

function showOptions() {
    requestAnimationFrame(() => {
        optionsDiv.classList.remove('hidden');
        const buttons = optionsDiv.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.1}s`;
            button.classList.add('fade-in');
        });
    });
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
    olivia_orchids_mentioned = false;
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
    if (num >= 1 && num <= currentOptions.length) {
        const option = currentOptions[num - 1];
        handleOptionSelect(option);
    }
});
//endregion

//endregion FUNCTIONS



window.onload = init;