let outputDiv;
let optionsDiv;
let currentScene = 'intro';
let KacperMet = false;

const scenes = {
    intro: {
        text: '════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n                                     WELCOME TO MIDNIGHT\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════\n\nYour aunt was recently found murdered.\nYou are one of the best detectives, you have been handed the case.\n\nWho do you want to interrogate?\n\n',
        options: [
            { text: 'Kacper', nextScene: 'kacper' },
            { text: 'Jane', nextScene: 'jane' },
            { text: 'Tongyu', nextScene: 'tongyu' },
            { text: 'Herby', nextScene: 'herby' },
            { text: 'Euan', nextScene: 'euan' }
        ]
    },
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
    jane: {
        text: 'Jane is your aunt\'s longtime maid. She seems nervous.\n\n',
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
        text: 'Jane says she was cleaning the house all day and heard nothing unusual.\n\n',
        options: [
            { text: 'Ask about her relationship with your aunt', nextScene: 'jane_relationship' },
            { text: 'Back to Jane', nextScene: 'jane' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    tongyu: {
        text: 'Tongyu is the gardener. He\'s been with the family for years.\n\n',
        options: [
            { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
            { text: 'Ask about suspicious activity', nextScene: 'tongyu_activity' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    tongyu_garden: {
        text: 'Tongyu says the garden was well-maintained, no issues.\n\n',
        options: [
            { text: 'Ask about suspicious activity', nextScene: 'tongyu_activity' },
            { text: 'Back to Tongyu', nextScene: 'tongyu' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    tongyu_activity: {
        text: 'Tongyu mentions seeing a stranger near the house the day before.\n\n',
        options: [
            { text: 'Ask about the garden', nextScene: 'tongyu_garden' },
            { text: 'Back to Tongyu', nextScene: 'tongyu' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    herby: {
        text: 'Herby is the butler. He\'s very formal and composed.\n\n',
        options: [
            { text: 'Ask about the household schedule', nextScene: 'herby_schedule' },
            { text: 'Ask about any arguments', nextScene: 'herby_arguments' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    herby_schedule: {
        text: 'Herby provides a detailed schedule of the day\'s events.\n\n',
        options: [
            { text: 'Ask about any arguments', nextScene: 'herby_arguments' },
            { text: 'Back to Herby', nextScene: 'herby' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    herby_arguments: {
        text: 'Herby admits there was a heated argument between your aunt and Kacper earlier that day.\n\n',
        options: [
            { text: 'Ask about the household schedule', nextScene: 'herby_schedule' },
            { text: 'Back to Herby', nextScene: 'herby' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan: {
        text: 'Euan is the chauffeur. He looks worried.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'euan_car' },
            { text: 'Ask about his whereabouts', nextScene: 'euan_whereabouts' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan_car: {
        text: 'Euan says the car was parked in the garage all day.\n\n',
        options: [
            { text: 'Ask about his whereabouts', nextScene: 'euan_whereabouts' },
            { text: 'Back to Euan', nextScene: 'euan' },
            { text: 'Back to interrogation room', nextScene: 'intro' }
        ]
    },
    euan_whereabouts: {
        text: 'Euan claims he was polishing the car in the garage.\n\n',
        options: [
            { text: 'Ask about the car', nextScene: 'euan_car' },
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
    log(scene.text);
    displayOptions(scene.options);
}

function displayOptions(options) {
    optionsDiv.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = `[${index + 1}] ${option.text}`;
        button.onclick = () => {
            currentScene = option.nextScene;
            displayScene();
        };
        optionsDiv.appendChild(button);
    });
}

window.onload = init;