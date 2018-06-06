# 简析Myers

Myers差分算法是由Eugene W.Myers在1986年发表的一篇论文中提出，可以查看文末参考部分的链接。

我们经常使用的`git diff`使用的就是此算法



## 高质量的diff

先简单定义下**diff**:  通过一系列的"编辑"，将字符串a转为字符串b



diff结果有很多，譬如可以将一个字符串全部删除，再添加另一整个字符串。可以删一个字符添加一个字符……

那什么样的diff是"更好的"

具体可以查看"参考"链接1，这里不再赘述

总结大概几点条件: 

1. 最小的改动
2. 删除优先新增
3. 新增或删除的内容应该遵循代码结构



所以，现在问题是，*从一个字符串转另一个字符串同时满足上述条件*

科学家告诉我们，此抽象问题可以建模为一个图搜索的问题



## 编辑图

假设字符串`a = 'ABCABBA'`  `b = 'CBABAC'`

那么编辑图看起来就如下所示

a的长度记为N，这里N = 7，b的长度记为M，这里M = 6

每个点都可以对应一个坐标(x, y)

![graph](https://user-gold-cdn.xitu.io/2018/5/28/163a600beb44a8ea?w=371&h=372&f=jpeg&s=44945)



现在从(0, 0)点出发，这时字符串为`a`, 通过向右移动，即增加x值，相当于从`a`中删除一个字符，例如从(0, 0)到(1, 0)意味着删除字符'A'。通过向下移动，即增加y值，相当于从`b`中增加一个字符，例如从(1, 0)到(1, 1)意味着插入字符'C'，此时通过前面两步移动，我们得到编辑后的字符串为 'CBCABBA'

除了向右，向下移动，我们还可以斜向移动，例如点(2, 0)，由于a的第3个字符为'C'，b的第一个字符为'C'，即表示有相同字符，保留即可，不增加也不删除。注意，斜向移动是无代价的，因为在其上移动是对字符串不做任何改动



#### 一些名词罗列及解释

###### Trace

路径中斜线边的"匹配点"，组成的序列，长度为L



###### Shortest Edit Script(SES)

最短编辑脚本。仅包含两种命令: 删除和添加

从(0, 0)到(N, M)脚本删除 N - L 个字符，添加了 M - L 个字符

所以对每一个trace，有一个对应的编辑脚本 D = N + M - 2L



###### Longest Common Subsequence(LCS)

最长公共子序列。高质量diff中条件1，表明需要寻找两个字符串的LCS

LCS大小等于Trace的长度L



论文说明了，寻找LCS的问题与寻找一条从(0, 0)到(N, M)同时有最多数量斜边的问题(\*) 是等价的

寻找SES与寻找一条从(0, 0)到(N, M)同时有最少数量的非斜边的问题(\*\*) 是等价的

而(\*)和(\*\*)是同一问题的两个方面



现在考虑给图加权重，横向和竖向边权重为1，斜向边权重为0

那么LCS/SES 问题就等同于在 这个权重编辑图中 寻找一条从(0, 0)到)(N, M)代价最低的一条路径



你想到了什么? bfs, dijkstra, 或者是dp... ? 貌似都可行……



## 一个O((M+N)D)贪心算法

寻找最短编辑脚本的问题简化为*寻找一条从(0, 0)到(N, M)有最少横向和树向边数路径的问题*

![graph](https://user-gold-cdn.xitu.io/2018/5/28/163a5d84ea9555af?w=531&h=507&f=jpeg&s=65398)

####一些名词罗列及解释

###### snake

蛇形线

一条snake表示 横(竖)向移动一步后接跟着的尽可能多的斜向移动 组成的线

如：从(0, 1)移动到(0, 2)顺着斜线一直到(2, 4)，(0, 1) - (0, 2) - (2, 4)组成一条snake

如上图深蓝色的线



###### diagonal k

斜线k，k(斜)线

定义 k = x - y, k相同的点组成一条直线，他们是相互平行的斜线

如上图中的棕黄色的线



###### d-path

移动d步的点的连线

如上图浅蓝色的线



#### 两个引理及证明

*引理1 一个D-path的终点必然在k斜线上，其中k ∈ { -D, -D + 2, ... D -2 , D}*

归纳法证明:

0-path(最多包含斜线，否则就是0点)必然是在 斜线 0上 

假设D-path终点在k上，k ∈ { -D, -D + 2, ... D -2 , D}，那么 (D+1)-path，由 前D-path组成，假设终点在k线上，那么横(竖)向移动一步后，终点必然在k+1, k-1线上，后面即使跟着斜线依然在k+1, k-1线上。

所以 (D+1)-path 终点必然在斜线 {-D ± 1, (-D + 2) ± 1 ... D ± 1} = { -D - 1, -D + 1, ... D - 1, D + 1}，因此得证。

此引理说明，**当D是奇数时，D-path都落在奇数k线上，D是偶数时，D-path都落在偶数k线上**



*引理2  0-path的最远到达点为(x, x)，其中x ∈ min(z - 1 || az ≠ bz or z > M 或 z > N)。D-path的最远到达点在k线上，可以被分解为在k-1 线上的(D-1)-path，跟着一条横向边，接着一条越长越好的斜边 和 在k+1 线上的(D-1)-path，跟着一条竖向边，接着一条越长越好的斜边*

证明看论文吧



此引理包含了一条贪婪原则: **D-path可以贪婪地延伸(D-1)-path的最远到达点获得**

这就符合高质量diff的条件3，尽可能多的匹配相同的字符



#### 举个例子

为了理解前面的引理及名词，现在求d = 3时，即d-path的各个终点坐标

![edit graph](https://user-gold-cdn.xitu.io/2018/5/28/163a600052a7a47d?w=389&h=560&f=jpeg&s=50386)

将上图转换为下表

![](https://user-gold-cdn.xitu.io/2018/5/28/163a5fc2b21cc444?w=464&h=509&f=jpeg&s=46851)



k = -3, 只能从 k = -2 向下移动，即(2, 4)向下移动至(2, 5)经斜线至(3, 6)

k = -1

​	可以由k=-2向右移动，即(2, 4)向右移动至(3, 4)经斜线至(4, 5)

​	也可由k=0想下移动，即(2, 2)向下移动至(2, 3)

​         因为同样在k = -1线上，(4, 5)比(2, 3)更远，所以我们选择k=-2这条

k = 1

​	可以由k = 0向右移动，即(2, 2)向右移动至(3, 2)经斜线至(5, 4)

​        也可由k = 2向下移动，即(3, 1)向下移动至(3, 2)经斜线至(5, 4)

​	我们会挑选起点x值更大一些的，因为删除优先嘛，所以选择k = 2这条

k = 3, 只能从 k = 2 向右移动，即(3, 1)向右移动至(4, 1)经斜线至(5, 2)



#### 简单实现

伪代码

![](https://user-gold-cdn.xitu.io/2018/5/28/163a6141f1369a61?w=579&h=458&f=jpeg&s=55594)



一些说明: 

* V数组包含D-path的最远到达点, V[-D], V[-D+2]...V[D-2], V[D]
* v[k]中存储的值，为在k线上最远达到点的横轴坐标值x，因为y可以通过x - k计算
* v[1] = 0，设置一个起点为(0, -1)，用于查找0-path的最远到达点



js: 直接粘贴到chrome控制台试试?

```javascript
function myers(stra, strb) {
  let n = stra.length
  let m = strb.length

  let v = {
    '1': 0
  }
  let vs = {
    '0': { '1': 0 }
  }
  let d

  loop:
  for (d = 0; d <= n + m; d++) {
    let tmp = {}

    for (let k = -d; k <= d; k += 2) {
      let down = k == -d || k != d && v[k + 1] > v[k - 1]
      let kPrev = down ? k + 1 : k - 1

      let xStart = v[kPrev]
      let yStart = xStart - kPrev

      let xMid = down ? xStart : xStart + 1
      let yMid = xMid - k

      let xEnd = xMid
      let yEnd = yMid

      while(xEnd < n && yEnd < m && stra[xEnd] === strb[yEnd]) {
        xEnd++
        yEnd++
      }
      
      v[k] = xEnd
      tmp[k] = xEnd

      if (xEnd == n && yEnd == m) {
        vs[d] = tmp
        let snakes = solution(vs, n, m, d)
        printRes(snakes, stra, strb)

        break loop
      }
    }

    vs[d] = tmp
  }
}

function solution(vs, n, m, d) {
  let snakes = []
  let p = { x: n, y: m }
  
  for (; d > 0; d--) {
    let v = vs[d]
    let vPrev = vs[d-1]
    let k = p.x - p.y

    let xEnd = v[k]
    let yEnd = xEnd - k
    
    let down = k == -d || k != d && vPrev[k + 1] > vPrev[k - 1]
    let kPrev = down ? k + 1 : k - 1
    
    let xStart = vPrev[kPrev]
    let yStart = xStart - kPrev
    
    let xMid = down ? xStart : xStart + 1
    let yMid = xMid - k
    
    snakes.unshift([xStart, xMid, xEnd])

    p.x = xStart
    p.y = yStart
  }

  return snakes
}

function printRes(snakes, stra, strb) {
  let grayColor = 'color: gray'
  let redColor = 'color: red'
  let greenColor = 'color: green'
  let consoleStr = ''
  let args = []
  let yOffset = 0
  
  snakes.forEach((snake, index) => {
    let s = snake[0]
    let m = snake[1]
    let e = snake[2]
    let large = s
    
    if (index === 0 && s !== 0) {
      for (let j = 0; j < s; j++) {
        consoleStr += `%c${stra[j]}`
        args.push(grayColor)
        yOffset++
      }
    }
    
    // 删除
    if (m - s == 1) {
      consoleStr += `%c${stra[s]}`
      args.push(redColor)
      large = m
    // 添加
    } else {
      consoleStr += `%c${strb[yOffset]}`
      args.push(greenColor)
      yOffset++
    }
    
    // 不变
    for (let i = 0; i < e - large; i++) {
      consoleStr += `%c${stra[large+i]}`
      args.push(grayColor)
      yOffset++
    }
  })

  console.log(consoleStr, ...args)
}

let s1 = 'are you ok?'
let s2 = 'i am very ok'
myers(s1, s2)
```



时间复杂度: 期望为O(M+N+D^2)，最坏情况为为O((M+N)D)

空间复杂度: O(D^2)



#### 优化

论文中给出了O(D)空间复杂度的一个优化，以后抽空再写吧。有兴趣的朋友可以在参考中查看



##  参考

http://xmailserver.org/diff2.pdf

http://cjting.me/misc/how-git-generate-diff/

https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/

https://www.codeproject.com/articles/42279/investigating-myers-diff-algorithm-part-of







## 一个线性空间的优化

考虑从(N, M)到(0, 0)



分治



引理3:  存在一条D-path从(0, 0)到(N, M) 当且仅当 存在一条$$ \lceil D/2 \rceil $$-path，从(0, 0)到某点(x, y)及一条$$ \lfloor D/2 \rfloor $$-path从某点(u, v)到(N, M)，这样

(feastbility)	u + v ≥ $$ \lceil D/2 \rceil $$ and x + y ≤ N + M - $$ \lfloor D/2 \rfloor $$, and

(overlap)	x - y = u - v and x ≥ u



寻找最优路径的middle snake



delta = N - M

前向路径，对角线以0为中心

反向路径，对角线以delta为中心



再者，由引理1，当delta为奇(偶)时，最优编辑脚本长度为奇(偶)。



(伪代码见论文P11)



