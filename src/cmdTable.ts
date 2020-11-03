import {getRandom} from "./commands/random"
import { newQuote } from "./commands/new"
import { list } from "./commands/list"
import { stats } from "./commands/stats"
import { setTemplate } from "./commands/template"
import { update } from "./commands/update"
import { edit } from "./commands/edit"
import { init } from "./commands/init"
import { remove } from "./commands/remove"
import { getTag } from "./commands/getTag"

export const commands = [
    {
        invokers: [
            "quote",
            "random"
        ],
        permission: [
            "everyone"
        ],
        function: getRandom
    },
    {
        invokers: [
            "new"
        ],
        permission: [
            "everyone"
        ],
        function: newQuote
    },
    {
        invokers: [
            "list"
        ],
        permission: [
            "everyone"
        ],
        function: list
    },
    {
        invokers: [
            "stat",
            "stats",
            "statistics"
        ],
        permission: [
            "everyone"
        ],
        function: stats
    },
    {
        invokers: [
            "template",
            "setTemplate"
        ], 
        permission: [
            "everyone"
        ],
        function: setTemplate
    },
    {
        invokers: [
            "update"
        ], 
        permission: [
            "everyone"
        ],
        function: update
    },
    {
        invokers: [
            "edit"
        ],
        permission: [
            "everyone"
        ],
        function: edit
    },
    {
        invokers: [
            "init",
            "initialize",
            "initialise"
        ],
        permission: [
            "everyone"
        ],
        function: init
    },
    {
        invokers: [
            "delete",
            "remove"
        ],
        permission: [
            "everyone"
        ],
        function: remove
    },
    {
        invokers: [
            "getTag",
            "tag"
        ],
        permission: [
            "everyone"
        ],
        function: getTag
    }
]