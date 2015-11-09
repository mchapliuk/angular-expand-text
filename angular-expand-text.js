/**
 * Created by Maksym Chapliuk on 01.10.15.
 */

'use strict';

angular.module('mch.expandText', [])
    .directive('mchExpandText', ['$compile', '$filter', function($compile, $filter) {
        var template =
            '<div name="mch-angular-expand-wrapper">' +
            '   <p name="mch-angular-expand-visible-text" ng-animate="\'animate\'"></p>' +
            '   <span>' +
            '       <a href="">{{ currentLinkText }}</a>' +
            '   </span>' +
            '</div>';

        return {
            restrict: 'EA',
            template: template,
            scope: {
                options: '=',
                text: '='
            },
            //compile: function compile(element, attrs) {
            //
            //},

            link: function postLink(scope, element, attrs) {

                function _limitWordsCount(text, wordsCount) {
                    /* Split string by spaces into an array */
                    var _arrText = text.split(' ');
                    if (_arrText.length) {
                        _arrText = _arrText.slice(0, wordsCount);
                    }
                    return _arrText.join(' ');
                }

                var expandCollapseLink = element.find('a');

                var options = scope.options || attrs.options || {};

                scope.showMoreText = options.showMoreText || 'Show More...';
                scope.showLessText = options.showLessText || 'Show Less...';
                scope.isCollapsed = options.isCollapsed || true;
                scope.lettersCount = attrs.lettersCount;
                scope.addEllipsis = options.addEllipsis || true;
                scope.ellipsis = options.ellipsis || '...';
                scope.linkPlace = options.linkPlace || 'left';


                scope.originText = scope.text || attrs.text || element.text() || '';

                if (scope.lettersCount) {
                    if (scope.originText && scope.originText.length > scope.lettersCount) {
                        var visibleLength = scope.addEllipsis ? scope.lettersCount - scope.ellipsis.length : scope.lettersCount;
                        scope.visibleText = $filter('limitTo')(scope.originText, visibleLength, 0);
                        scope.addEllipsis && (scope.visibleText += scope.ellipsis);
                        scope.collapsedText = scope.visibleText;
                    }
                }

                /* Where pu the link */
                var link = {
                    right: function () {
                        element.find('div').css('overflow', 'auto');
                        element.find('span').css('float', 'right');
                    },
                    left: function () {
                        return;
                    },
                    center: function () {
                        return;
                    }
                };

                link[scope.linkPlace]();

                scope.$watch('visibleText', function(value) {
                    element.find('p').text(value);
                });

                scope.$watch('isCollapsed', function() {
                    scope.currentLinkText = scope.isCollapsed ? scope.showMoreText : scope.showLessText;
                });

                expandCollapseLink.on('click', function() {
                    if (scope.isCollapsed) {
                        scope.visibleText = scope.originText;
                        scope.isCollapsed = false;
                        scope.$apply();
                    } else {
                        scope.visibleText = scope.collapsedText;
                        scope.isCollapsed = true;
                        scope.$apply();
                    }
                });


                //scope.text = scope.originText;

                //element.html(template);
                //$compile(element)(scope);
            }
        };
    }]);
