console.log("["+new Date().toLocaleTimeString()+"] Base Script Loaded Success");
Parse.initialize("7QTpBogc0rQIaGMX8H4LPV6FPKFNQVuC6fh2Oidb", "OloSDXCQ5TE4T5w8nIl8tjln5wAkrznA3qe9StdI");
Parse.serverURL = "https://parseapi.back4app.com/";
//load menu
var tbMenu = Parse.Object.extend("tb_menu");
var tbHeader = Parse.Object.extend("tb_header");
var tbStar = Parse.Object.extend("tb_star");
var tbCategory = Parse.Object.extend("tb_category");
var tbArticle = Parse.Object.extend("tb_article");

loadHeader();
loadMenu();
loadSubStar();
loadSubCategory();
loadArticle()

////////////////////////////////////////////////////////////////////////////////
// event js
$(document).on("click", "#close-ads", function(e){
    $('.modal-ads').hide();
});

$(document).on("click", "#navbarDropdown", function(e){
    var children = $(this).attr("children");
    var href = $(this).attr("href");
    var type = $(this).attr("type");
    localStorage.setItem("followClick", (href == "javascript:void(0);") ? type+".html" : href );
    if (children === "true") {
        switch(type) {
            case "star":
                var list_star = JSON.parse(localStorage.getItem("jsStars"));
                loadSubStarShow(list_star);
            break;
            case "category":
            var list_category = JSON.parse(localStorage.getItem("jsCategories"));
                loadSubCategoryShow(list_category);
            break;
        }
        
    }else{
        location.href = href;
    }
});

$(document).on("click", "#link1", function(e){
    var link = $(this).attr("link");
    $("#videoPlayer").attr("src", link);
    changeLink("link1");
});

$(document).on("click", "#link2", function(e){
    var link = $(this).attr("link");
    $("#videoPlayer").attr("src", link);
    changeLink("link2");
});

////////////////////////////////////////////////////////////////////////////////
// function libs
async function loadMenu() {
    query = new Parse.Query(tbMenu);
    query.limit(100);
    query.find().then(function(menus){
        if(menus){
            loadMenus(menus);
        } else {
            console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);       
    });
}

function loadMenus(menus) {
    $("#menus").empty();
    $.each(menus, function(index, value){
        var source = $("#menu-template").html();
        var template = Handlebars.compile(source);
        var context = {
            name_menu: value.attributes.name_menu,
            url: (value.attributes.children == true) ? "javascript:void(0);" : value.attributes.url,
            children: value.attributes.children,
            type: value.attributes.type,
            classDropdown: (value.attributes.children == true) ? "dropdown" : "",
            classDropdownToggle: (value.attributes.children == true) ? "dropdown-toggle" : "",
            allowDropdown: (value.attributes.children == true) ? "dropdown" : "",
            idMenu: (value.attributes.children == true) ? value.attributes.idMenu : 0,
        };
        var html = template(context);
        $("#menus").append(html);
    });
}

async function loadHeader() {
    query = new Parse.Query(tbHeader);
    query.limit(100);
    query.find().then(function(headers){
        if(headers){
            loadHeaders(headers);
        } else {
            console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

function loadHeaders(headers) {
    headers = headers[0];
    const favicon = document.querySelector('[rel=icon]');
    favicon.href = headers.attributes.favicon;
    document.title = headers.attributes.title;
    document.querySelector(".blog-header-logo").text = headers.attributes.blog_header_logo;
    document.querySelector(".blog-header-logo").href = headers.attributes.url;
}

async function loadSubStar() {
    query = new Parse.Query(tbStar);
    query.limit(100);
    query.find().then(function(stars){
        if(stars){
            saveToLocalStorage(stars, "jsStars");
        } else {
            localStorage.setItem("jsStars", "");
            console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

async function loadSubCategory() {
    query = new Parse.Query(tbCategory);
    query.limit(100);
    query.find().then(function(categories){
        if(categories){
            saveToLocalStorage(categories, "jsCategories");
        } else {
            localStorage.setItem("jsCategories", "");
            console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

async function loadArticle() {
    query = new Parse.Query(tbArticle);
    query.limit(1000);
    query.find().then(function(articles){
        if(articles){
            saveToLocalStorage(articles, "jsArticles");
        } else {
            localStorage.setItem("jsArticles", "");
            console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });
}

function loadSubStarShow(stars) {
    $("#dropDownMenuStar").empty();
    $.each(stars, function( index, value ) {
        var source = $("#submenu-template").html();
        var template = Handlebars.compile(source);
        var context = {
            id: value.id,
            name: value.name,
            menu: "star",
        };
        var html = template(context);
        $("#dropDownMenuStar").append(html);
    });
}

function loadSubCategoryShow(category) {
    $("#dropDownMenuCategory").empty();
    $.each(category, function( index, value ) {
        var source = $("#submenu-template").html();
        var template = Handlebars.compile(source);
        var context = {
            id: value.id,
            name: value.name,
            menu: "category",
        };
        var html = template(context);
        $("#dropDownMenuCategory").append(html);
    });
}

function saveToLocalStorage(json, name){
    var rs = new Array();
    switch (name){
        case "jsStars":
        case "jsCategories":
            $.each(json, function(index, value){
                var t = {
                    id: value.id,
                    url: value.attributes.url,
                    name: value.attributes.name,
                }
                rs.push(t);
            });
        break;
        case "jsArticles":
            $.each(json, function(index, value){
                var t = {
                    id: value.id,
                    author: value.author,
                    url: value.attributes.url,
                    name: value.attributes.name,
                    link1: value.attributes.link1,
                    link2: value.attributes.link2,
                    image: value.attributes.image,
                    category_id: value.attributes.category_id.parent.id,
                    star_id: value.attributes.star_id.parent.id,
                    likes: value.attributes.likes,
                    dislikes: value.attributes.dislikes,
                    view_count: value.attributes.view_count,
                    locked: value.attributes.locked,
                    author: value.attributes.author,
                    selftext_html: value.attributes.selftext_html,
                    images: value.attributes.images,
                    created: value.createdAt,
                }
                rs.push(t);
            });
        break;
    }
    localStorage.setItem(name, JSON.stringify(rs));
}

function timeConsole(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ', ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
            "Aug","Sep","Oct","Nov","Dec"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ', ' + date + ' ' + year;
    return time;
}

function timeConverterDDMMYYYY(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear();
    var month = (a.getMonth()+1);
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = `${date}/${month}/${year}`;
    return time;
}

function base_url() {
    var url = location.origin + getProject(location.pathname);
    return url;
}

function getProject(path_url){
    var path = '';
    var arr = path_url.split("/");
    arr.forEach(function (element, index) {
        if (index === 0 || index === (arr.length - 1)){
        }else {
            path = path+"/"+element;
        }
    });
    return path;
}

function changeLink(change){
    if (change == "link2"){
        $("#link1").addClass("btn-light").addClass("btn-outline-primary");
        $("#link1").removeClass("btn-primary");
        $("#link2").addClass("btn-primary");
        $("#link2").removeClass("btn-light").removeClass("btn-outline-primary");
    }else{
        $("#link2").addClass("btn-light").addClass("btn-outline-primary");
        $("#link2").removeClass("btn-primary");
        $("#link1").addClass("btn-primary");
        $("#link1").removeClass("btn-light").removeClass("btn-outline-primary");
    }
}

function resizePost(){
    var clientWidth = document.documentElement.clientWidth;
    if (clientWidth < 748){
        $("#posts-category").addClass("d-none");
    }else{
        $("#posts-category").removeClass("d-none");
    }
}

function shuffle(array, id) {
    array = array.filter(function(el) { return el.id != id; }); 
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}