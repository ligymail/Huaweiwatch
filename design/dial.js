(function () {
  var CX = 227;
  var CY = 227;
  var SIZE = 454;

  var THEMES = {
    day: {
      bg: "#F6F3ED",
      fg: "#1C1C1C",
      tick: "rgba(28,28,28,0.32)",
      heart: "#C4473A",
      hand: "#171717",
      inlay: "#F6F3ED",
      rule: "rgba(28,28,28,0.38)"
    },
    night: {
      bg: "#000000",
      fg: "#F4F1EA",
      tick: "rgba(244,241,234,0.38)",
      heart: "#FF8B82",
      hand: "#F4F1EA",
      inlay: "#000000",
      rule: "rgba(244,241,234,0.42)"
    }
  };

  function ticks(t) {
    var out = "";
    for (var i = 0; i < 60; i++) {
      var rad = (i * 6 * Math.PI) / 180;
      var cardinal = i % 15 === 0;
      var hour = i % 5 === 0;
      var outer = 216;
      var inner = cardinal ? 192 : hour ? 200 : 208;
      var sw = cardinal ? 3 : hour ? 2.15 : 1.15;
      out +=
        '<line x1="' + (CX + Math.sin(rad) * inner).toFixed(2) +
        '" y1="' + (CY - Math.cos(rad) * inner).toFixed(2) +
        '" x2="' + (CX + Math.sin(rad) * outer).toFixed(2) +
        '" y2="' + (CY - Math.cos(rad) * outer).toFixed(2) +
        '" stroke="' + (hour ? t.fg : t.tick) + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    }
    return out;
  }

  function hands(t, hour, minute) {
    var hourAngle = (hour % 12) * 30 + minute * 0.5;
    var minuteAngle = minute * 6;
    return (
      '<g transform="rotate(' + minuteAngle + " " + CX + " " + CY + ')">' +
      '<polygon points="' + CX + "," + (CY - 176) + " " + (CX + 5.2) + "," + (CY - 18) + " " +
      (CX + 3) + "," + (CY + 34) + " " + (CX - 3) + "," + (CY + 34) + " " + (CX - 5.2) + "," + (CY - 18) +
      '" fill="' + t.hand + '"/>' +
      '<polygon points="' + CX + "," + (CY - 148) + " " + (CX + 1.5) + "," + (CY - 40) + " " +
      (CX - 1.5) + "," + (CY - 40) + '" fill="' + t.inlay + '"/>' +
      "</g>" +
      '<g transform="rotate(' + hourAngle + " " + CX + " " + CY + ')">' +
      '<polygon points="' + CX + "," + (CY - 124) + " " + (CX + 8) + "," + (CY - 18) + " " +
      (CX + 4.6) + "," + (CY + 30) + " " + (CX - 4.6) + "," + (CY + 30) + " " + (CX - 8) + "," + (CY - 18) +
      '" fill="' + t.hand + '"/>' +
      '<polygon points="' + CX + "," + (CY - 102) + " " + (CX + 2.1) + "," + (CY - 36) + " " +
      (CX - 2.1) + "," + (CY - 36) + '" fill="' + t.inlay + '"/>' +
      "</g>" +
      '<circle cx="' + CX + '" cy="' + CY + '" r="9.5" fill="' + t.hand + '"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="3.6" fill="' + t.inlay + '"/>'
    );
  }

  function footprint(color) {
    return (
      '<g fill="' + color + '">' +
      '<ellipse cx="7.15" cy="16.15" rx="3.05" ry="4.85" transform="rotate(-16 7.15 16.15)"/>' +
      '<circle cx="4.15" cy="8.55" r="1.42"/><circle cx="6.55" cy="7.15" r="1.42"/><circle cx="8.95" cy="8.05" r="1.28"/>' +
      '<ellipse cx="16.55" cy="15.35" rx="3.05" ry="4.85" transform="rotate(14 16.55 15.35)"/>' +
      '<circle cx="13.7" cy="7.55" r="1.42"/><circle cx="16.15" cy="6.25" r="1.42"/><circle cx="18.55" cy="7.45" r="1.28"/>' +
      "</g>"
    );
  }

  function heart(color) {
    return (
      '<path fill="' + color + '" d="M12 20.15s-6.55-4.05-6.55-8.95c0-2.28 1.78-4.05 3.95-4.05 ' +
      '1.22 0 2.3.56 2.98 1.48.68-.92 1.76-1.48 2.98-1.48 2.17 0 3.95 1.77 3.95 4.05 0 4.9-6.55 8.95-6.55 8.95z"/>'
    );
  }

  function icon(x, y, size, body) {
    return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24">' + body + "</svg>";
  }

  /* The dateline is an HTML flex row laid over the dial, so the browser
     centres it. Measuring glyph widths by hand made the group drift. */
  function dateline(t, date, weekday) {
    return (
      '<div style="position:absolute;left:0;right:0;top:86px;height:34px;' +
      "display:flex;align-items:center;justify-content:center;gap:14px;" +
      "font-family:DialHan,'Noto Sans',sans-serif;font-size:26px;font-weight:500;" +
      "font-variant-numeric:tabular-nums;color:" + t.fg + '">' +
      "<span>" + date + "</span>" +
      '<i style="display:block;width:1px;height:22px;background:' + t.rule + '"></i>' +
      "<span>" + weekday + "</span>" +
      "</div>"
    );
  }

  function render(el, themeName, data) {
    var t = THEMES[themeName] || THEMES.day;
    var iconSize = 34;
    var iconY = 286;
    var numberY = 362;
    var columnLeft = 152;
    var columnRight = 302;

    el.style.position = "relative";
    el.style.width = SIZE + "px";
    el.style.height = SIZE + "px";
    el.style.background = t.bg;
    el.style.borderRadius = "50%";
    el.style.overflow = "hidden";
    el.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + SIZE + '" height="' + SIZE +
      '" viewBox="0 0 454 454" style="display:block;position:absolute;inset:0">' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="227" fill="' + t.bg + '"/>' +
      ticks(t) +
      icon(columnLeft - iconSize / 2, iconY, iconSize, footprint(t.fg)) +
      icon(columnRight - iconSize / 2, iconY, iconSize, heart(t.heart)) +
      '<text x="' + columnLeft + '" y="' + numberY + '" text-anchor="middle" fill="' + t.fg +
      '" font-family="DialHan, sans-serif" font-size="32" font-weight="500">' + data.steps + "</text>" +
      '<text x="' + columnRight + '" y="' + numberY + '" text-anchor="middle" fill="' + t.fg +
      '" font-family="DialHan, sans-serif" font-size="32" font-weight="500">' + data.bpm + "</text>" +
      hands(t, data.hour, data.minute) +
      "</svg>" +
      dateline(t, data.date, data.weekday);
    return el;
  }

  window.renderWatchFace = render;
  window.WATCH_THEMES = THEMES;
})();
