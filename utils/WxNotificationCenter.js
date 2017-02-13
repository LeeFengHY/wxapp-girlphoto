/*
微信小程序通知广播模式类,降低小程序之间的耦合度
*/
//存放
var __notices = [];
var isDebug = false;

/**
 * addNotification
 * 注册通知对象方法
 * 
 * 参数:
 * name： 注册名，一般let在公共类中
 * selector： 对应的通知方法，接受到通知后进行的动作
 * observer: 注册对象，指Page对象
 */
function addNotification(name, selector, observer)
{
    if(name && selector)
    {
        if(!observer)
        {
            console.log("addNotification Warning: no observer will can't remove notice");
        }
        console.log("addNotification:" + name);
        var newNotice = {
            name: name,
            selector:selector,
            observer:observer
        }
        addNotices(newNotice);
    }else{
        console.log("addNotification error: no selector or name");
    }
}

//为page添加通知
function addNotices(newNotice)
{
    if(__notices.length > 0)
    {
        for(var i = 0; i < __notices.length;i++)
        {
            var hisNotice = __notices[i];
            //当名称一样时进行对比，如果不是同一个，则放入数组，否则跳出
            if(newNotice.name === hisNotice.name)
            {
                if(!cmp(hisNotice, newNotice))
                {
                    __notices.push(newNotice);
                }
                return;
            }else{
                __notices.push(newNotice);
            }
        }
    }
    __notices.push(newNotice);
}

/**
 * removeNotification
 * 移除通知方法
 * 
 * 参数:
 * name: 已经注册了的通知
 * observer: 移除的通知所在的Page对象
 */
function removeNotification(name, observer)
{
    for(var i = 0; i < __notices.length; i++)
    {
        var notice = __notices[i];
        if(notice.name === name)
        {
            if(notice.observer === observer)
            {
                __notices.splice(i,1);
                return;
            }
        }
    }
}

/**
 * postNotificationName
 * 发送通知方法
 * 
 * 参数:
 * name: 已经注册了的通知
 * info: 携带的参数
 */
function postNotificationName(name, info)
{
    if(__notices.length == 0)
    {
        console.log("postNotificationName error: you havdn't add any notice");
        return;
    }

    for (var i = 0; i < __notices.length; i++)
    {
        var notice = __notices[i];
        if(notice.name === name)
        {
            notice.selector(info);
        }
    }
}

//用于对比两个对象是否相等
function cmp(x, y)
{
    if(x === y)
    {
        return true;
    }

    if(!(x instanceof Object) || !(y instanceof Object))
    {
        return false;
    }

    if(x.constructor !== y.constructor)
    {
        return false;
    }

    for (var p in x)
    {
        if (x.hasOwnProperty(p))
        {
            if(!y.hasOwnProperty(p))
            {
                return false;
            }

            if(x[p] === y[p])
            {
                continue;
            }

            if(typeof(x[p]) !== "Object")
            {
                return false;
            }

            if(!Object.equals(x[p], y[p]))
            {
                return false;
            }
        }

        for (p in y)
        {
            if(y.hasOwnProperty(p) && !x.hasOwnProperty(p))
            {
                return false;
            }
        }
        return true;
    }
}

module.exports = {
    addNotification: addNotification,
    removeNotification: removeNotification,
    postNotificationName: postNotificationName
}