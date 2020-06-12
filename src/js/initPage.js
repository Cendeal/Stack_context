//please insert utils.js before
function bindNode(node, object, property) {
    Object.defineProperty(object, property, {
        set(v) {
            node.innerText = v
        },
        get() {
            return node.innerText
        }
    })

}

function generateDiv(item, i, divs) {
    let temp = document.getElementById(item)
    let display = ''
    if (temp) {
        display = temp.style.display
        temp.remove()
    }

    let div = document.createElement('div')
    div.style.display = display
    div.innerText = div.title = `#${i}-${item}`
    div.className = classes[item] + ' box'
    div.id = item
    div.addEventListener('click', () => {
        currentControl.value = item
        currentControl.flag = false
        currentControl.position.top = 0
        currentControl.position.left = 0
    })
    divs.push(div)
}

function show() {
    document.getElementById('setting').hidden = true
    document.getElementById('bottom').hidden = false
}

function hiddenBottom() {
    document.getElementById('setting').hidden = false
    document.getElementById('bottom').hidden = true
}

function move(direction) {
    const move_t = document.getElementById(currentControl.value)
    const is_inline = currentControl.value.includes('inline')
    if (move_t) {
        switch (direction) {
            case 'up':
                if (is_inline) {
                    move_t.style.top = `${currentControl.position.top -= 10}px`
                } else {
                    move_t.style.marginTop = `${currentControl.position.top -= 10}px`
                }
                break
            case 'left':
                if (is_inline) {
                    move_t.style.left = `${currentControl.position.left -= 10}px`
                } else {
                    move_t.style.marginLeft = `${currentControl.position.left -= 10}px`
                }
                break
            case 'right':
                if (is_inline) {
                    move_t.style.left = `${currentControl.position.left += 10}px`
                } else {
                    move_t.style.marginLeft = `${currentControl.position.left += 10}px`
                }
                break
            case 'down':
                if (is_inline) {
                    move_t.style.top = `${currentControl.position.top += 10}px`

                } else {
                    move_t.style.marginTop = `${currentControl.position.top += 10}px`
                }
                break
        }
    }

}

function resetIt() {
    div_boxes.forEach(item => {
        const move_t = document.getElementById(item)
        const is_inline = item.includes('inline')
        if (move_t) {
            if (!is_inline) {
                move_t.style.marginTop = ''
                move_t.style.marginLeft = ''
            } else {
                move_t.style.top = ''
                move_t.style.left = ''
            }

        }
    })
    currentControl.value = '无(点击div选择目标)'
    currentControl.position.top = 0
    currentControl.position.left = 0

}

function init() {
    const root = document.getElementById('root')
    let moveSelectNode = document.getElementById('action')
    let orders = document.getElementById('order')
    if(is_pc){
        orders.innerHTML ='<span style="display: block">拖动切换顺序：<button onclick="change()">确定更换</button></span>'
    }else {
        orders.innerHTML ='<span style="display: block">点击两两切换顺序：</span>'
    }


    let nodes = []
    let divs = []
    let buttons = []

    for (let i = 1; i <= div_boxes.length; i++) {
        let item = div_boxes[i - 1]
        generateDiv(item, i, divs)
        // init checkbox
        let sp_t = document.getElementById(item + 'sp')
        if (sp_t) {
            sp_t.remove()
        }
        let sp = document.createElement('span')
        sp.id = item + 'sp'

        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = true
        checkbox.value = item
        checkbox.addEventListener('click', () => {
            const target = document.getElementById(item)
            if (!checkbox.checked && target) {
                target.style.display = 'none'
            } else {
                target.style.display = ''
            }
        })

        let span = document.createElement('span')
        span.innerText = `#${i}-${item}`

        //init order button
        const button_t = document.getElementById(`${item}_btn`)
        if (button_t) {
            button_t.remove()
        }
        const button = document.createElement('button')
        button.className = `${item.replace(/([A-Z])/g, "-$1").toLowerCase()}-color order-btn`
        button.innerText = `#${i}-${item}`
        button.id = `${item}_btn`

        if(is_pc){
            button.draggable = true
            button.ondrop = (event) => {
                event.preventDefault();
                let data = event.dataTransfer.getData("button")
                console.log(data, 'data');
                let target_button = document.getElementById(data)
                let src_button = event.target
                console.log(src_button)
                swap(target_button, src_button)
            }
            button.ondragover = (event) => {
                event.preventDefault();
            }
            button.ondragstart = (event) => {
                event.dataTransfer.setData("button", event.target.id);
            }
        }

        buttons.push(button)


        sp.append(checkbox, span)
        nodes.push(sp)
    }
    root.append(...divs)
    moveSelectNode.append(...nodes)
    orders.append(...buttons)
    setIndexPosition()
}

function swap(a, b) {
    let temp = {
        id: a.id,
        innerText: a.innerText,
        className: a.className
    };
    a.id = b.id
    a.innerText = b.innerText
    a.className = b.className
    Object.assign(b, temp)
}

function setIndexPosition() {
    const val = document.getElementById('select').value;
    let zIndex = document.getElementsByClassName('z-index')
    for (let item of zIndex) {
        item.style.position = val
    }
}

function change() {
    const buttons = document.getElementById('order').querySelectorAll(`button[id$='_btn']`)
    div_boxes = []
    buttons.forEach(button => {
        div_boxes.push(button.id.replace(/_btn/g, ''))
    })
    init()
}

const is_pc = isPc()
let div_boxes = ['zIndexPositive', 'zIndexAuto', 'inline', 'inlineBlock', 'float', 'block', 'zIndexZero', 'zIndexNegative']
let currentControl = {
    id: 'current_control',
    value: '无(点击div选择目标)',
    position: {
        top: 0,
        left: 0
    }
}
const classes = {
    inline: 'inline inline-color',
    inlineBlock: 'inline-block inline-block-color',
    float: 'float float-color',
    block: 'block block-color',
    zIndexPositive: 'z-index-positive-color z-index-positive z-index',
    zIndexZero: 'z-index-zero z-index z-index-zero-color',
    zIndexNegative: 'z-index-negative z-index z-index-negative-color',
    zIndexAuto: 'z-index-auto z-index z-index-auto-color'
}
init()
bindNode(document.getElementById(currentControl.id), currentControl, 'value')