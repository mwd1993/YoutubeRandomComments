// ==UserScript==
// @name         YoutubeRandomComments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomly shows a comment overlayed onto the current Youtube video!
// @author       Marc github.com/mwd1993
// @match        http://*/*
// @match        https://www.youtube.com/watch?v=*
// @match        http://www.youtube.com/watch?v=*
// @match        youtube.com/watch?v=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Initialize variables
    // ------------------------------------------------------------------------------------
    // ---------------- youtube selectors, which obviously can and will change ------------
    // ------------------------------------------------------------------------------------
    var videoSelector = "div#player-container-inner.style-scope.ytd-watch-flexy";
    var videoSelector2 = "div.html5-video-container";
    var commentSelector = "div#main.style-scope.ytd-comment-renderer";
    var commentLiveSelector1 = "span#message[dir='auto']";//"[dir='auto']";
    var commentLiveSelector2 = "[class='style-scope yt-live-chat-text-message-renderer']";
    var commentLoadedSelector = "div#icon-label.style-scope.yt-dropdown-menu";
    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    var commentComponentSelector = "p#ccs";
    var nameComponentSelector = "p#ncs";
    var likesComponentSelector = "p#lcs";
    var randomCommentTimeoutMS = 15000;
    var waitForKeyElementLoaded = false;
    var nameComponent, commentComponent, likesComponent;

    waitForKeyElements(commentLoadedSelector,keyElementFunction);
    var commentLoadedInterval = setInterval(function() {waitingForCommentsToLoad();}, 1500);

    function waitingForCommentsToLoad()
    {
        var el = document.querySelectorAll(commentLoadedSelector);
        if(el)
        {
            clearInterval(commentLoadedInterval);
        }
    }

    function keyElementFunction()
    {
        if(!waitForKeyElementLoaded)
        {
            getNameComponent();
            getLikesComponent();
            getCommentComponent();
            var method = displayRandomComment;
            setInterval(method, randomCommentTimeoutMS);
            method();
            showComponents();
            hideComponents();
            waitForKeyElementLoaded = true;
        }
    }

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
            pTag.style.fontSize = "12px";
            pTag.style.padding = "4px";
            pTag.style.width = "38%";
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
        else if(get_what == "likes")
        {
            var split = textSplit[textSplit.length-2];
            if(split == commentGet(commentElement,"comment")) return 0;
            return split;
        }
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

    function hideComponents()
    {
        likesComponent = document.querySelector(likesComponentSelector);
        commentComponent = document.querySelector(commentComponentSelector);
        nameComponent = document.querySelector(nameComponentSelector);

        likesComponent.display = "none";
        commentComponent.display = "none";
        nameComponent.display = "none";
    }

    function showComponents()
    {
        likesComponent = document.querySelector(likesComponentSelector);
        commentComponent = document.querySelector(commentComponentSelector);
        nameComponent = document.querySelector(nameComponentSelector);

        likesComponent.display = "block";
        commentComponent.display = "block";
        nameComponent.display = "block";
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
