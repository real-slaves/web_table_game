module.exports = {
    primalName: "GO_WHITE",
    getData(count = 100) {
        return {
            option: {
                class: 'go_black',

                width: 40,
                height: 40,
                reverse: false,
                front: {
                    image: `./assets/go/go_black.png`
                },
                back: {
                    image: `./assets/go/go_black.png`
                },
                style: {}
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}