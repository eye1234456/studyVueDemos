export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};

const image = 'https://s10.mogucdn.com/mlcdn/c45406/180926_45fkj8ifdj4l824l42dgf9hd0h495_750x390.jpg';
export function fakeGoodsList(count, oldIndex, type) {
  let mock_goodsList = Array(count).fill(1).map((obj, index) => {
    let idx = oldIndex + index;
    return {
      id: idx,
      iid: idx,
      title: `${type}--${idx}`,
      image: image,
      price: 10,
      cfav: 12
    }
  });
  return mock_goodsList;
}

export function fakeDetail(iid) {

  return {
    itemInfo: {
      topImages: [image, image],
      title: 'title',
      desc: 'desc',
      price: 111,
      oldPrice: 123,
      discountDesc: 'discountDesc'
    },
    columns: [],
    shopInfo: {
      services: [
        { name: 'service.name' }
      ]
    },
    detailInfo: {},
    itemParams: {
      info: {},
      rule: ''
    },
    rate: {
      list: [
        {
          user: {
            avatar: 'avatar',
            uname: 'uname'
          },
          content: 'content',
          images: [image]
        }
      ]
    }
  };
}
