const arr = [
    {
        "id": 1,
        "name": "evan",
        "job": {
            "area": "IT",
            "salary": "22222"
        }
    },

    {
        "id": 2,
        "name": "json",
        "job": {
            "area": "boss",
            "salary": "3333"
        }
    },
    {
        "id": 3,
        "name": "leo",
        "job": {
            "area": "CE0",
            "salary": "100000"
        }
    }
]

let li = arr.map(v => {
    return {
        "value": v.id,
        "name": v.name
    }
})

console.log(li)
