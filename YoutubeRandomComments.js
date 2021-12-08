// ==UserScript==
// @name         YoutubeRandomComments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomly shows a comment underneath the video!
// @author       Marc github.com/mwd1993
// @match        http://*/*
// @match        https://www.youtube.com/watch?v=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Run the program in 5 seconds..
    // It won't show comments until the user
    // scrolls down and loads some...
    // is there a non hacky way to get comments
    // to show before a user scrolls down?
    window.addEventListener('load', function() {

        setTimeout(function(){
            setInterval(displayRandomComment, randomCommentTimeoutMS);
        }, 5000);

        setTimeout(function(){
            getNameComponent();
            getLikesComponent();
            getCommentComponent();
        }, 5000);

    }, false);

    // Initialize variables
    var randomCommentTimeoutMS = 15000;
    // ------------------------------------------------------------------------------------
    // ---------------- youtube selectors, which obviously can and will change ------------
    // ------------------------------------------------------------------------------------
    var videoSelector = "div#player-container-inner.style-scope.ytd-watch-flexy";
    var videoSelector2 = "div.html5-video-container";
    var commentSelector = "div#main.style-scope.ytd-comment-renderer";
    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    var commentComponentSelector = "p#ccs";
    var nameComponentSelector = "p#ncs";
    var likesComponentSelector = "p#lcs";
    var nameComponent, commentComponent, likesComponent;

    // Name component get/initializer
    function getNameComponent()
    {
        if(nameComponent == undefined)
        {
            var pTag = document.createElement("p");
            pTag.innerText = "name";
            pTag.style.color = "white";
            pTag.style.zIndex = "2000";
            pTag.style.fontSize = "26px";
            pTag.style.padding = "4px";
            pTag.style.paddingTop = "12px";
            pTag.style.paddingLeft = "20px";
            pTag.style.position = "absolute";
            pTag.id = "ncs";
            document.querySelector(videoSelector2).appendChild(pTag);
        }
        nameComponent = document.querySelector(nameComponentSelector);
        return nameComponent;
    }

    // Likes component get/initializer
    function getLikesComponent()
    {
        if(likesComponent == undefined)
        {
            var pTag = document.createElement("p");
            pTag.innerText = "likes";
            pTag.style.color = "white";
            pTag.style.zIndex = "2000";
            pTag.style.fontSize = "12px";
            pTag.style.padding = "4px";
            pTag.style.width = "50%";
            pTag.style.paddingLeft = "30px";
            pTag.style.top = "46px";
            pTag.style.position = "absolute";
            pTag.id = "lcs";
            document.querySelector(videoSelector2).appendChild(pTag);
        }
        likesComponent = document.querySelector(likesComponentSelector);
        return likesComponent;
    }

    // Comment component get/initializer
    function getCommentComponent()
    {
        if(commentComponent == undefined)
        {
            var pTag = document.createElement("p");
            pTag.innerText = "comment";
            pTag.style.color = "white";
            pTag.style.zIndex = "2000";
            pTag.style.fontSize = "16px";
            pTag.style.padding = "4px";
            pTag.style.width = "50%";
            pTag.style.paddingLeft = "30px";
            pTag.style.position = "absolute";
            pTag.style.top = "64px";
            pTag.id = "ccs";
            document.querySelector(videoSelector2).appendChild(pTag);
        }
        commentComponent = document.querySelector(commentComponentSelector);
        return commentComponent;
    }



    // Extract string data from provided element
    function commentGet(commentElement,get_what)
    {
        var text = commentElement.innerText, textSplit = text.split("\n"), comment, commentNext = false;
        if(get_what == "name") return textSplit[0];
        else if(get_what == "comment")
        {
            textSplit.forEach(function(t) {
                if(commentNext)
                {
                    comment = t;
                    commentNext = false;
                    return;
                }
                if(t.toLowerCase().includes("ago")) commentNext = true;
            });
            return comment;
        }
        else if(get_what == "likes") return textSplit[textSplit.length-2];
    }

    // Get a random comment and display it on the video inner container
    function displayRandomComment()
    {
        var el = document.querySelectorAll("div#main.style-scope.ytd-comment-renderer");
        if(el)
        {
            var video = document.querySelector("div#player-container-inner.style-scope.ytd-watch-flexy");
            var randomEl = el[getRandomInt(0,el.length)];
            if(randomEl)
            {
                var likes = commentGet(randomEl,"likes");
                var name = commentGet(randomEl,"name");
                var commentFinal = commentGet(randomEl,"comment");
                var pTagNameComponent = getNameComponent();
                var pTagLikesComponent = getLikesComponent();
                var pTagCommentComponent = getCommentComponent();

                pTagNameComponent.innerText = name;
                pTagLikesComponent.innerText = "👍" + likes;
                pTagCommentComponent.innerText = commentFinal;
            }
        }
    }

    // Min max between to integers
    function getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Higher level console.log
    function echo(string)
    {
        console.log(string);
    }
})();
