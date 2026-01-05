let outputDiv;
let optionsDiv;
let currentScene = 'intro';
let welcomeDiv;

let kacper_cooked = false;
let tongyu_salad = false;
let tongyu_salad = false;

//region Scenes Definition
const scenes = {
    //region Intro Scene
    intro: {
        text: '════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n                                                           WELCOME TO MIDNIGHT\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n',
        options: [
            { text: 'Kacper', nextScene: 'kacper' },
            { text: 'Jane', nextScene: 'jane' },
            { text: 'Tongyu', nextScene: 'tongyu' },
            { text: 'Herby', nextScene: 'herby' },
            { text: 'Euan', nextScene: 'euan' }
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
                { text: 'Hand her the salad', nextScene: 'tongyu_salad' },
                { text: 'Back to Tongyu', nextScene: 'tongyu' },
                { text: 'Back to interrogation room', nextScene: 'intro' }
            ]
        },
            tongyu_salad: {
                text: 'Tongyu thanks you for the salad, and mentions how this is the sales guy favorite food.\n\n',
                options: [
                    { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
                    { text: 'Back to Tongyu', nextScene: 'tongyu' },
                    { text: 'Back to interrogation room', nextScene: 'intro' }
                ]
            },
    //endregion
    herby: {
        text: 'Herby is the chauffeur. He looks worried.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'herby_car' },
            { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    herby_car: {
        text: 'Herby says the car was parked in the garage all day.\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'herby_whereabouts' },
            { text: 'Back to Herby', nextScene: 'herby' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    herby_whereabouts: {
        text: 'Herby claims he was polishing the car in the garage.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'herby_car' },
            { text: 'Back to Herby', nextScene: 'herby' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan: {
        text: 'Euan is the salesman. He\'s very formal and composed.\n\n',
        options: [
            { text: 'Ask about the household schedule', nextScene: 'euan_schedule' },
            { text: 'Ask about any arguments', nextScene: 'euan_arguments' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan_schedule: {
        text: 'Euan provides a detailed schedule of the day\'s events.\n\n',
        options: [
            { text: 'Ask about any arguments', nextScene: 'euan_arguments' },
            { text: 'Back to Euan', nextScene: 'euan' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan_arguments: {
        text: 'Euan admits there was a heated argument between your aunt and Kacper earlier that day.\n\n',
        options: [
            { text: 'Ask about the household schedule', nextScene: 'euan_schedule' },
            { text: 'Back to Euan', nextScene: 'euan' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    }
};

function init() {
    outputDiv = document.getElementById('output');
    optionsDiv = document.getElementById('options');
    displayScene();
}

function log(text) {
    outputDiv.textContent += text;
}

function clearOutput() {
    outputDiv.textContent = '';
}

function displayScene() {
    const scene = scenes[currentScene];
    clearOutput();
    if (currentScene === 'intro') {
        if (!welcomeDiv) {
            welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome';
            welcomeDiv.textContent = 'WELCOME TO MIDNIGHT';
            document.body.appendChild(welcomeDiv);
        }
        const introText = '\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n';
        log(introText);
    } else {
        if (welcomeDiv) {
            document.body.removeChild(welcomeDiv);
            welcomeDiv = null;
        }
        log(scene.text);
    }
    let options = [...scene.options];
    if (currentScene === 'kacper' && !kacper_cooked) {
        options.splice(2, 0, { text: 'Ask about what he cooked', nextScene: 'kacper_meal' });
    }
    displayOptions(options);
}

function displayOptions(options) {
    optionsDiv.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = `[${index + 1}] ${option.text}`;
        button.onclick = () => {
            if (option.nextScene === 'kacper_meal') {
                kacper_cooked = true;
            }
            if (option.nextScene === 'tongyu_salad') {
                tongyu_salad = true;
            }
            currentScene = option.nextScene;
            displayScene();
        };
        optionsDiv.appendChild(button);
    });
}

window.onload = init;