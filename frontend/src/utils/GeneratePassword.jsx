function generatePassword(length = 8) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allCharacters = uppercase + lowercase + numbers;

    let result = [
        uppercase[Math.floor(Math.random() * uppercase.length)],
        lowercase[Math.floor(Math.random() * lowercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)]
    ];

    for (let i = 3; i < length; i++) {
        result.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    // Shuffle the array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
}

export default generatePassword;