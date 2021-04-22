// 訂單驗證欄位
const form = document.querySelector('.myForm');
const inputs = document.querySelectorAll('input[name]');

const constraints = {
  姓名: {
    presence: {
      message: '必填',
    },
  },

  電話: {
    presence: {
      message: '必填',
    },

    length: {
      minimum: 8,
      message: '需要超過 8 碼',
    },
  },
  信箱: {
    presence: {
      message: '必填',
    },
    email: {
      message: '請填寫 Email 格式',
    },
  },
  寄送地址: {
    presence: {
      message: '必填',
    },
  },
  交易方式: {
    presence: {
      message: '必填',
    },
  },
};

inputs.forEach((item) => {
  item.addEventListener('blur', function () {
    item.nextElementSibling.textContent = '';
    let errors = validate(form, constraints) || '';

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        // console.log(document.querySelector(`[data-message=${keys}]`))
        document.querySelector(`[data-message="${keys}"]`).textContent =
          errors[keys];
      });
    }
  });
});
