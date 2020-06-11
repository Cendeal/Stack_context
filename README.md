# 关于z-index属性

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591855325199-139008e0-ac05-464e-8b96-8e09e6dda95f.png#align=left&display=inline&height=334&margin=%5Bobject%20Object%5D&name=image.png&originHeight=668&originWidth=994&size=580096&status=done&style=none&width=497)
这张图的总结是存在问题的，是不正确的：
(1)任意元素的z-index要起作用是由条件的：必须指定position的值(非static)。否则，即使给了z-index属性元素的层叠只与出现顺序有关。**假设图片的条件是正常流(也就是元素没有给position的情况下)**，如果负z-index最后才现，那么它必然是处于最接近用户的顶层，此时图片的结论明显就错了。**再假设它设置了position，使得z-index生效图也是错的**，本身没有设置z-index的情况，默认就是为0层，也就是z-index为0([参考文档](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/Adding_z-index))。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591874993096-65ebcaf6-6c06-4ca1-b3f4-7987001acc24.png#align=left&display=inline&height=231&margin=%5Bobject%20Object%5D&name=image.png&originHeight=279&originWidth=900&size=32025&status=done&style=stroke&width=746)
这种情况其实就是任意元素(无论行内还是块级)本身，它们的层叠顺序就是只和出现顺序有关，最后图片的总结还是错的。这里我写了代码演示可以拷贝去测试，这里是[演示地址](https://cendeal.github.io/Stack_context/)。图中设置z-index的元素position为relative。其中的数字为层级出现顺序。如图:
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591874332016-3d13fdab-a444-4514-bacc-abcd064a7242.png#align=left&display=inline&height=649&margin=%5Bobject%20Object%5D&name=image.png&originHeight=880&originWidth=1011&size=63451&status=done&style=shadow&width=746)
源码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Stack context</title>
    <style>
        div {
            width: 500px;
            height: 30px;
        }

        .root {
            height: 500px;
            width: 800px;
            margin-top: 100px;
            background: rgba(26, 255, 214, 0.85);
        }

        .block {
            display: block;
            background: dodgerblue;
            transform: rotate(-35deg);
        }

        .block-inline {
            display: inline-block;
            background: blue;
            transform: rotate(-13deg);
        }

        .float {
            float: left;
            background: green;
            transform: rotate(-69deg);
        }

        .inline {
            display: inline;
            background: greenyellow;
            padding-right: 1000px;
        }

        .z-index-auto {
            z-index: auto;
            background: orange;
            transform: rotate(-56deg);
        }

        .z-index-zero {
            z-index: 0;
            background: oldlace;
            transform: rotate(-139deg);
        }

        .z-index-plus {
            z-index: 1;
            background: red;
            transform: rotate(-110deg);
        }

        .z-index-sub {
            z-index: -1;
            background: purple;
            transform: rotate(-91deg);
        }
        .bottom{
            margin: 25px;
            border-radius: 10px;
            position: fixed;
            max-width: 600px;
            z-index: 9999;
            bottom: 0;
            table-layout: fixed;
            background: rgba(0,0,0,0.5);
            color: white;
        }

    </style>
</head>
<body>
<table class="bottom">
    <tr>
        <td>zIndex的position</td>
        <td>
            <select id="select">
                <option>static</option>
                <option>relative</option>
                <option>absolute</option>
                <option>sticky</option>
            </select>
            <button onclick="setIndexPosition()">确定</button>
        </td>
    </tr>
    <tr>
        <td>显示/隐藏</td>
        <td id="action"></td>
    </tr>
</table>

<div class="root" id="root" title="0#root">0#root

</div>
<script>
    const moves = ['zIndexPlus' , 'zIndexAuto',  'inline', 'inlineBlock','float', 'block',  'zIndex0', 'zIndexSub']
    const classes = {
        inline:'inline',
        inlineBlock:'block-inline',
        float:'float',
        block:'block',
        zIndexPlus:'z-index-plus z-index',
        zIndex0:'z-index-zero z-index',
        zIndexSub:'z-index-sub z-index',
        zIndexAuto:'z-index-auto z-index'
    }

    function init() {
        const root = document.getElementById('root')
        let moveSelectNode = document.getElementById('action')
        let nodes = []
        let divs = []
        for (let i=1 ;i<=moves.length;i++) {
            let item = moves[i-1]
            let div = document.createElement('div')
            div.innerText = div.title = `#${i}-${item}`
            div.className = classes[item]
            div.id = item
            divs.push(div)

            // init checkbox
            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.checked = true
            checkbox.value = item
            checkbox.addEventListener('click',()=>{
                const target = document.getElementById(item)
                if(!checkbox.checked&&target){
                    target.style.visibility = 'hidden'
                }else {
                    target.style.visibility = 'visible'
                }
            })
            let span = document.createElement('span')
            span.innerText = `#${i}-${item}`
            nodes.push(checkbox)
            nodes.push(span)
        }
        root.append(...divs)
        moveSelectNode.append(...nodes)
    }


    function setIndexPosition() {
        const val = document.getElementById('select').value;
        let zIndex = document.getElementsByClassName('z-index')
        console.log(zIndex)
        for (let item of zIndex) {
            item.style.position = val
        }
    }
    init()

</script>
</body>
</html>
```
(2)层叠上下文background/border并没有说明是最底层，还是参考层，如果在图中这样表示应该可以理解为默认层，如果是默认层，那么负z-index的元素应该是置于该默认层之下，参考文档[链接](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Adding_z-index)。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591872149979-c7f3e17e-bc97-4f2c-a2a3-ecefb6ba0eca.png#align=left&display=inline&height=432&margin=%5Bobject%20Object%5D&name=image.png&originHeight=466&originWidth=804&size=26172&status=done&style=shadow&width=746)
(3)按照图片的理解似乎z-index属性与display和float不能共存。