$(document).ready(function() {
    var ul = document.getElementById("map-list");
    var all_maps_req = new XMLHttpRequest();
    all_maps_req.onload = function () {
        console.log("got maps");
        if (all_maps_req.readyState = XMLHttpRequest.DONE) {
            var all_maps = JSON.parse(all_maps_req.response);
            console.log(all_maps[0]);
            var i;
            for (i = 0; i < all_maps.length; i++) {
                var curr_map_id = all_maps[i]["mapId"];
                console.log("adding map " + all_maps[i]["mapId"]);
                var li = document.createElement("li");
                li.setAttribute("id", "li" + i);
                li.setAttribute("data-val", curr_map_id);
                // var a = document.createElement("a");
                // a.setAttribute("id", "li" + i);
                // $('a[id="li' + i + '"]').attr('href', 'http://localhost:8080/maps/');
                var li_id = "li" + i;

                // console.log(li_id);
                ul.appendChild(li);
                $('li[id="' + li_id + '"]').html('<a href="#">' + curr_map_id + '</as>').click(function (e) {
                    e.preventDefault();
                    // console.log("getting curr_map_id: " + $(e.currentTarget).data("val"));
                    window.location.replace("http://localhost:8080/" + $(e.currentTarget).data("val"));
                });
            }
        }
    }
    all_maps_req.open("GET", "http://localhost:8080/maps/loadAllMaps", true);
    all_maps_req.send();

    // var i;
    // for (i = 0; i < 5; i++) {
    //     var li = document.createElement("li");
    //     li.setAttribute("id", "li" + i);
    //     // var a = document.createElement("a");
    //     // a.setAttribute("id", "li" + i);
    //     // $('a[id="li' + i + '"]').attr('href', 'http://localhost:8080/maps/');
    //     var li_id = "li" + i;

    //     // console.log(li_id);
    //     ul.appendChild(li);
    //     $('li[id="' + li_id + '"]').html('<a href="#">map ' + i + '</as>').click(function (e) {
    //         alert("hey");
    //     });
    // }
});