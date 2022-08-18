function getBall_x () {
    return parseFloat(getComputedStyle(document.querySelector('.ball')).getPropertyValue('--x'))
}

function setBall_x (value) {
    document.querySelector('.ball').style.setProperty('--x', value)
}

function getBall_y () {
    return parseFloat(getComputedStyle(document.querySelector('.ball')).getPropertyValue('--y'))
}

function setBall_y (value) {
    document.querySelector('.ball').style.setProperty('--y', value)
}

function isCollision(rect1, rect2, posNextX, posNextY) {
    return rect1.left + posNextX <= rect2.right && rect1.right + posNextX >= rect2.left && rect1.top + posNextY <= rect2.bottom && rect1.bottom + posNextY >= rect2.top
}

function updateBall(delta) {
    velocity += 0.000001 * delta // 0.000001

    const BallRect = document.querySelector('.ball').getBoundingClientRect()
    const PlayerRect = document.querySelector('.sidebar-left-dock').getBoundingClientRect()
    const ComputerRect = document.querySelector('.sidebar-right-dock').getBoundingClientRect()

    if (BallRect.bottom + (direction.y * velocity * delta) >= window.innerHeight || BallRect.top  + (direction.y * velocity * delta) <= 0) {
        direction.y  *= -1
    }

    if (isCollision(BallRect, PlayerRect, (direction.x * velocity * delta), (direction.y * velocity * delta)) || isCollision(BallRect, ComputerRect, (direction.x * velocity * delta), (direction.y * velocity * delta))) {
        direction.x  *= -1
    }

    setBall_x(getBall_x() + (direction.x * velocity * delta))
    setBall_y(getBall_y() + (direction.y * velocity * delta))

    if (BallRect.right >= window.innerWidth) {
        startGame = false

        document.querySelector('.sidebar-right-dock').style.backgroundColor = '#bb3d55'

        setTimeout(() => {
            document.querySelector('.sidebar-right-dock').style.backgroundColor = '#00000033'
        }, 1000)

        reset()
    } else if (BallRect.left <= 0) {
        startGame = false

        document.querySelector('.sidebar-left-dock').style.backgroundColor = '#bb3d55'

        setTimeout(() => {
            document.querySelector('.sidebar-left-dock').style.backgroundColor = '#00000033'
        }, 1000)

        reset()
    }
}

let lastTime
let direction = { x : 0, y: 0 }

while (Math.abs(direction.x) <= .2 || Math.abs(direction.y) >= .9) {
    const heading = Math.random() * ((2 * Math.PI) - 0) + 0
    direction = { x: Math.cos(heading), y: Math.sin(heading)}
}

let velocity = 0.015

function setPlayer_y (value) {
    document.querySelector('.sidebar-left-dock').style.setProperty('--position', value)
}

function getComputer_y() {
    return parseFloat(getComputedStyle(document.querySelector('.sidebar-right-dock')).getPropertyValue('--position'))
}   

function setComputer_y (value) {
    document.querySelector('.sidebar-right-dock').style.setProperty('--position', value)
}

function updateComputer(delta) {
    setComputer_y(getComputer_y() + (0.005 * delta * (getBall_y() - getComputer_y())))
}

document.addEventListener('mousemove', (e) => {
    startGame && setPlayer_y((e.y / window.innerHeight) * 100);
})

function reset() {
    startGame = false

    document.querySelector('.ball').classList.add('hidden')
    document.querySelector('.sidebar-left-dock').classList.add('paused')
    document.querySelector('.sidebar-right-dock').classList.add('paused')

    velocity = 0.015
    direction = { x : 0, y: 0 }

    while (Math.abs(direction.x) <= .2 || Math.abs(direction.y) >= .9) {
        const heading = Math.random() * ((2 * Math.PI) - 0) + 0
        direction = { x: Math.cos(heading), y: Math.sin(heading)}
    }

    setComputer_y(50)
    setPlayer_y(50)
    setBall_x(50)
    setBall_y(51)

    document.querySelector('.ball').dispatchEvent(new Event('gameOver'));
}

let startGame = false

function initiateGame() {
    startGame = true;
    document.querySelector('.ball').classList.remove('hidden')
    document.querySelector('.sidebar-left-dock').classList.remove('paused')
    document.querySelector('.sidebar-right-dock').classList.remove('paused')
}

function update(time) {
    if (lastTime != null && startGame) {
        const delta = time - lastTime
        updateBall(delta)
        updateComputer(delta)
    }
    lastTime = time
    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)