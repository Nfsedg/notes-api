const palindrome = (string) => {
    if(typeof string === 'undefined') return undefined
    return string
        .split('')
        .reverse()
        .join('')
}

const average = array => {
    if (array.length === 0) return 0
    let sum = 0
    array.forEach(num => { sum += num })

    return sum / array.length
}

module.exports = {
    palindrome,
    average
}

// function reverseData(array) {
//     let newArray = []
//     array.forEach(item => {
//         newArray.unshift(item)
//     })

//     return newArray
// }

// console.log(reverseData([0,1,2,3,4,5,6]))