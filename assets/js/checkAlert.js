// 是否要加入購物車商品確認
const checkAdd = () => {
  if (confirm('確定要加入購物車這筆商品嗎?')) {
    return true;
  } else {
    return false;
  }
};

// 是否要刪除確認
const checkDelete = () => {
  if (confirm('確定要刪除這筆商品嗎?')) {
    return true;
  } else {
    return false;
  }
};

//　是否要刪除全部購物車確認
const checkAllDelete = () => {
  if (confirm('請注意!! 確定要刪除所有購物車商品嗎?')) {
    return true;
  } else {
    return false;
  }
};

// 是否送出訂單確認
const checkOrderList = () => {
  if (confirm('確定要送出這筆訂單資訊嗎?')) {
    return true;
  } else {
    return false;
  }
};

// 是否要刪除客戶訂單資料確認
const checkDelCustInfo = () => {
  if (confirm('確定要刪除這筆客戶訂單資料嗎?')) {
    return true;
  } else {
    return false;
  }
};

// 是否已處理完客戶訂單資料
const checkCustStatus = () => {
  if (confirm('確定已處理完客戶訂單資料了嗎?')) {
    return true;
  } else {
    return false;
  }
};

// 是否要刪除所有客戶訂單資料確認
const checkDelCustAllInfo = () => {
  if (confirm('請注意!! 確定要刪除所有客戶訂單資料嗎?')) {
    return true;
  } else {
    return false;
  }
};
