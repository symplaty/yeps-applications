// =========================== Public ==================================

window.onload = function() {
    var rgMethod = document.getElementsByName("rm_method");
    if (rgMethod.length > 0) {
        for (var i = 0; i < rgMethod.length; i++) {
        	console.log(rgMethod[i]);
        }
    }

    setMethod();

}


// ============================= Test 01 ====================================
// 通过设置单选框的点击事件来实现样式的切换
function setMethod() {
	var riDefault = document.getElementById("default");
	var riBlock = document.getElementById("block");
	var riBlockFloat = document.getElementById("float");
	var imgs = document.getElementsByClassName("image-test");
	
	riDefault.checked = true;

	riDefault.onclick = function() {
		if (riDefault.checked) {
			console.log("default checked");
			// 取消所有的 style 属性设置，目前还没找到只删除某一个属性的办法(后来找到了，写在了在后面)
			for (var i = 0; i < imgs.length; i++) {
				imgs[i].removeAttribute("style");
				// 单独清除某个属性的方法，给其赋值为""
				// imgs[i].style.display = "";
				// imgs[i].style.float = "";
			}


		}
		// "riDefault.checked == false" 貌似不能触发 radio 元素的 onclick 事件
		// else {
		// 	console.log("default unchecked");
		// }
	}

	riBlock.onclick = function() {
		if (riBlock.checked) {
			console.log("block checked");
			for (var i = 0; i < imgs.length; i++) {
				imgs[i].removeAttribute("style");
				imgs[i].style.display = "block";
			}
		}
	}
	riBlockFloat.onclick = function() {
		if (riBlockFloat.checked) {
			console.log("float checked");
			for (var i = 0; i < imgs.length; i++) {
				imgs[i].removeAttribute("style");
				// imgs[i].style.display = "block";
				imgs[i].style.float = "left";
			}
		}
	}
}

// =============================== Test 02 ==========================================



