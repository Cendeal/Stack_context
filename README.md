# 关于z-index属性

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591855325199-139008e0-ac05-464e-8b96-8e09e6dda95f.png#align=left&display=inline&height=334&margin=%5Bobject%20Object%5D&name=image.png&originHeight=668&originWidth=994&size=580096&status=done&style=none&width=497)
这张图的总结是存在问题的，是不正确的：
(1)任意元素的z-index要起作用是由条件的：必须指定position的值(非static)。否则，即使给了z-index属性元素的层叠只与出现顺序有关。**假设图片的条件是正常流(也就是元素没有给position的情况下)**，如果负z-index最后才现，那么它必然是处于最接近用户的顶层，此时图片的结论明显就错了。**再假设它设置了position，使得z-index生效图也是错的**，本身没有设置z-index的情况，默认就是为0层，也就是z-index为0([参考文档](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/Adding_z-index))。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591874993096-65ebcaf6-6c06-4ca1-b3f4-7987001acc24.png#align=left&display=inline&height=231&margin=%5Bobject%20Object%5D&name=image.png&originHeight=279&originWidth=900&size=32025&status=done&style=stroke&width=746)
这种情况其实就是任意元素(无论行内还是块级)本身，它们的层叠顺序就是只和出现顺序有关，最后图片的总结还是错的。这里我写了代码演示可以拷贝去测试，这里是[演示地址](https://cendeal.github.io/Stack_context/)。图中设置z-index的元素position为relative。其中的数字为层级出现顺序。如图:
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591874332016-3d13fdab-a444-4514-bacc-abcd064a7242.png#align=left&display=inline&height=649&margin=%5Bobject%20Object%5D&name=image.png&originHeight=880&originWidth=1011&size=63451&status=done&style=shadow&width=746)
(2)层叠上下文background/border并没有说明是最底层，还是参考层，如果在图中这样表示应该可以理解为默认层，如果是默认层，那么负z-index的元素应该是置于该默认层之下，参考文档[链接](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Adding_z-index)。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/1343283/1591872149979-c7f3e17e-bc97-4f2c-a2a3-ecefb6ba0eca.png#align=left&display=inline&height=432&margin=%5Bobject%20Object%5D&name=image.png&originHeight=466&originWidth=804&size=26172&status=done&style=shadow&width=746)
(3)按照图片的理解似乎z-index属性与display和float不能共存。