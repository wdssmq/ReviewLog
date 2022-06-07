// Date 对象格式化为 "2021-12"
function fnFormatDate(oDate, strFormat = "yyyy-mm-dd") {
  let strRlt = strFormat;
  // dd
  let sDate = oDate.getDate();
  if (sDate < 10) {
    sDate = "0" + sDate;
  }
  strRlt = strRlt.replace(/dd/g, sDate);
  // mm
  let sMonth = oDate.getMonth() + 1;
  if (sMonth < 10) {
    sMonth = "0" + sMonth;
  }
  strRlt = strRlt.replace(/mm/g, sMonth);
  // yyyy
  const sYear = oDate.getFullYear();
  strRlt = strRlt.replace(/yyyy/g, sYear);
  // 返回结果
  return strRlt;
}

class Template {
  constructor(tpl) {
    let fn,
      match,
      code = [
        "let r=[];",
        "let _html = function (str) { return str.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };",
      ],
      re = /\{\s*([a-zA-Z\.\_0-9()]+)(\s*\|\s*safe)?\s*\}/m,
      addLine = function (text) {
        code.push(
          "r.push('" +
          text
            .replace(/\'/g, "\\'")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r") +
          "');"
        );
      };
    tpl = tpl.replace(/\s\\\n/g, "<br>");
    while ((match = re.exec(tpl))) {
      if (match.index > 0) {
        addLine(tpl.slice(0, match.index));
      }
      if (match[2]) {
        code.push("r.push(String(this." + match[1] + "));");
      } else {
        code.push("r.push(_html(String(this." + match[1] + ")));");
      }
      tpl = tpl.substring(match.index + match[0].length);
    }
    addLine(tpl);
    // code.push('console.log(r.join(""));');
    code.push('return r.join("").trim();');
    fn = new Function(code.join("\n"));
    this.render = function (model) {
      return fn.apply(model);
      s;
    };
  }
}

// 获取数组中某个元素的索引
function fnGetIndexInArray(arr, strVal) {
  let iRlt = -1;
  arr.forEach((el, i) => {
    if (el == strVal) {
      iRlt = i;
    }
  });
  return iRlt;
}

// Ajax 获取 YML 数据
function fnGetYMLAjax(strURL, strData, fnCallback) {
  $.ajax({
    url: strURL,
    type: "GET",
    data: strData,
    // dataType: "json",
    success: fnCallback
  });
}

// 解析 YML 数据
function fnParseYML(strYML) {
  // yml2obj
  const oData = jsyaml.load(strYML, "utf8");
  console.log(oData);
  // 解析
  const oRltAll = { x: [], data: { a: [], c: [] } };
  oData.forEach(el => {
    const oDate = el.date[0];
    const strDate = fnFormatDate(oDate, "yyyy-mm");
    // console.log(strDate);
    let iIndex = fnGetIndexInArray(oRltAll.x, strDate);
    if (iIndex < 0) {
      oRltAll.x.push(strDate);
      oRltAll.data.a.push(1);
      oRltAll.data.c.push(0);
      iIndex = oRltAll.x.length - 1;
    } else {
      oRltAll.data.a[iIndex] += 1;
    }
    // 判断状态
    const bolC = el.status === "通过" ? 1 : 0;
    if (bolC) {
      oRltAll.data.c[iIndex] += 1;
    }
  });
  const oRltPerson = { n: [], data: { a: [], c: [] } };
  oData.forEach(el => {
    const arrPeople = el.reviewers;
    arrPeople.forEach(name => {
      let nIndex = fnGetIndexInArray(oRltPerson.n, name);
      if (nIndex < 0) {
        oRltPerson.n.push(name);
        oRltPerson.data.a.push(1);
        oRltPerson.data.c.push(0);
        nIndex = oRltPerson.n.length - 1;
      } else {
        oRltPerson.data.a[nIndex] += 1;
      }
      // 判断状态
      const bolC = el.status === "通过" ? 1 : 0;
      if (bolC) {
        oRltPerson.data.c[nIndex] += 1;
      }
    });
  });
  // log
  console.log(oRltAll, oRltPerson);
  return { oRltAll, oRltPerson };
}

function fnViewAll(oData) {
  const tplTr = `<tr class="view-rlt">
        <td>{date}</td>
        <td>{c}</td>
        <td>{a}</td>
    </tr>`;
  const tpl = new Template(tplTr);
  let strRlt = "";
  const arrCount = { a: 0, c: 0 }
  oData.x.forEach((x, i) => {
    strRlt += tpl.render({
      date: x,
      a: oData.data.a[i],
      c: oData.data.c[i]
    });
    arrCount.a += oData.data.a[i];
    arrCount.c += oData.data.c[i];
  });
  strRlt += tpl.render({
    date: "合计",
    a: arrCount.a,
    c: arrCount.c
  });
  $("#all tr.view-rlt").remove();
  $("#all tr").after(strRlt);
}

function fnViewPerson(oData) {
  const tplTr = `<tr class="view-rlt">
        <td>{person}</td>
        <td>{c}</td>
        <td>{a}</td>
    </tr>`;
  const tpl = new Template(tplTr);
  let strRlt = "";
  const arrCount = { a: 0, c: 0 }
  oData.n.forEach((n, i) => {
    strRlt += tpl.render({
      person: n,
      a: oData.data.a[i],
      c: oData.data.c[i]
    });
    arrCount.a += oData.data.a[i];
    arrCount.c += oData.data.c[i];
  });
  strRlt += tpl.render({
    person: "合计",
    a: arrCount.a,
    c: arrCount.c
  });
  $("#person tr.view-rlt").remove();
  $("#person tr").after(strRlt);
}

function fnMain(yml) {
  $(".title-rlt").text(yml);
  const url = `https://cdn.jsdelivr.net/gh/wdssmq/ReviewLog@main/data/${yml}`;
  fnGetYMLAjax(url, "", function (resData) {
    // console.log(resData);
    const oData = fnParseYML(resData);
    fnViewAll(oData.oRltAll);
    fnViewPerson(oData.oRltPerson);
  });
}

