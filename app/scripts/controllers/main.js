'use strict';

angular.module('myApp')
    
/*
* Service
* Main goal is to manage all playable song
* Keep the currentSong, give to the audio-player
* the next, previous song ...
*/
    
    .factory( 'solution', function() {
        return { 
            paper: {
                rock: true ,
                scisor: false ,
                paper: null 
            },
            scisor: {
                rock: false ,
                scisor: null ,
                paper: true 
            },
            rock: {
                rock: null ,
                scisor: true ,
                paper: false 
            }
        };
    })

    .controller('MainCtrl', function ( $scope, solution ) {

        $scope.playerScore = 0;
        $scope.npcScore = 0;
        $scope.playerPick = '';
        $scope.npcPick = '';
        $scope.informationDisplay = 'Pick a sign'
        $scope.signPlayer = 'paperSign';
        $scope.signNpc = 'paperSign';

        var signsElement = document.querySelector( '#signs' ).children;
        var arrayOfSign = [ 'paper', 'scisor', 'rock' ];

        var playerSignElement = document.querySelector('.playerSign');
        var npcSignElement = document.querySelector('.npcSign');
        var playable = true;
        
        //Function used to handle transition END
        var transitionEndCb = function( element ){
            if( !playable ){
                setTimeout(function () {
                    element.classList.remove( "action" );
                    playable = true;
                }, 1000); 
            }
        };

        var bindElements = function(){
            for (var i = 0; i < signsElement.length; i++) {
                signsElement[i].addEventListener('click', function( e ) {
                    if( playable ){
                        playable = false;
                        $scope.playerPick = e.target.getAttribute('sign')
                        $scope.npcPick  = arrayOfSign[ Math.floor( Math.random() * arrayOfSign.length) ];
                        
                        // TODO -- Change this its ugly ;-) ( But work for the exercice )
                        playerSignElement.children[0].src = "http://localhost:9000/styles/images/" + $scope.playerPick + "Sign.png"
                        npcSignElement.children[0].src = "http://localhost:9000/styles/images/" + $scope.npcPick + "Sign.png"
                        
                        var result = checkResult( $scope.playerPick , $scope.npcPick );
                        
                        playerSignElement.classList.add( "action" );
                        npcSignElement.classList.add( "action" );
                        
                        switch ( result ) {
                            case false:
                                $scope.npcScore++;
                                $scope.informationDisplay = 'Loose';
                            break;
                            case true:
                                $scope.playerScore++;
                                $scope.informationDisplay = 'Win';
                            break;
                            case null:
                                $scope.informationDisplay = 'Draw !';
                            break;
                        }

                        $scope.$apply();
                    }
                } );
            }
        };

        var checkResult = function( sign, computerPick ){
            return solution[sign][computerPick];
        };

        bindElements();
        playerSignElement.addEventListener( "transitionend", transitionEndCb.bind( this, playerSignElement ) );
        npcSignElement.addEventListener( "transitionend", transitionEndCb.bind( this, npcSignElement ) );
    })