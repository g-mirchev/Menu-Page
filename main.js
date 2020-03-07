let request = new XMLHttpRequest();
let products;
request.open("GET", "./products.json");
request.send();
request.onload = () => {
    console.log(request);
    if (request.status === 200) {
       products = JSON.parse(request.response);   
    } else {
        console.log(`error ${request.status} ${request.statusText}`)
    }
    makeCards();
}
function makeCards() {
        let template = $(".card");
    for(let product in products){
       //console.log(products[product])
        let clone = template.clone();
        clone.toggleClass('spaced product');
        clone.attr("order", products[product].order);
        clone.attr("name", products[product].name);
        clone.attr("price", products[product].price);
        clone.attr("allergens", products[product].allergens);
        clone.find(".name").text(products[product].name);
        clone.find(".price").text('£' + products[product].price);
        var image = $('<img />');
        var div = $('<div />');
        div.attr("class", "overlay");
        image.attr("class", "img");
        image.on("error", function() {
            $(this).attr("src", "/images/noimg.png")
        }).attr("src", products[product].image_path)

        
        image.appendTo(clone.find(".imgcont"));
        div.appendTo(clone.find(".imgcont"));
        clone.appendTo(document.getElementById("products"));
    }   
}
let alrequest = new XMLHttpRequest();
let allergens;
alrequest.open("GET", "./allergens.json");
alrequest.send();
alrequest.onload = () => {
    console.log(alrequest);
    if (alrequest.status === 200) {
       allergens = JSON.parse(alrequest.response);
    } else {
        console.log(`error ${alrequest.status} ${alrequest.statusText}`)
    }
    makeFilters();
}
function makeFilters(){
    for(let allergen in allergens){
        var checkbox = $('<input type="checkbox">');
        var label = $('<label></label><br/>');
        var div = $('<div />');
        checkbox.attr("id", allergens[allergen].name);
        checkbox.attr("name", 'filterby');
        checkbox.attr("value", allergens[allergen].id);
        label.attr("for", allergens[allergen].id);
        label.text(allergens[allergen].name);
        div.attr("class", "sortoption");
        checkbox.appendTo(div);
        label.appendTo(div);
        div.appendTo(document.getElementById("filter"));
    }
}
$(document).ready(function(){
    $('#sort').change(function(){
        var option = $("input[name='sortby']:checked").val();
        sortMenu(option);
    });
});
function sortMenu(option){
    $('#products').append($('#products .card').sort(function(a,b){
        switch(option) {
            case "priceascending":
                return a.getAttribute('price')-b.getAttribute('price');
            case "pricedescending":
                return b.getAttribute('price')-a.getAttribute('price');
            case "name":
                if (a.getAttribute('name')>b.getAttribute('name')){
                    return 1;
                }
                if (a.getAttribute('name')<b.getAttribute('name')) {
                    return -1;
                }
                return 0;
            case "order":
                return a.getAttribute('order')-b.getAttribute('order');
        }
        return a.getAttribute('price')-b.getAttribute('price');
    }));
}
$(document).ready(function(){
    $('#filter').change(function(){
       var filters = $("input[name='filterby']:checked").map(function(){
           return $(this).val();
       }).get().sort();
        console.log(filters);
        filterMenu(filters)
    });
});
function filterMenu(filters){
    $(".card").each(function(){
        var result = this.getAttribute('allergens');
        if(result !== null){
            result = result.split`,`.map(x=>+x).sort();
            console.log(result);
            var hide = false;
            for(let filter in filters) {
                console.log(parseInt(filters[filter]));
                if(!result.includes(parseInt(filters[filter]))) {
                    hide = true;
                }
            }
            console.log(hide);
            $(this).toggleClass("hidden", hide);
        }
    });
}
