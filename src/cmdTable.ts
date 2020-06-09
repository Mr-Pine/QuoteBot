import {getRandom} from "./commands/random"
import { newQuote } from "./commands/new"
import { list } from "./commands/list"
import { stats } from "./commands/stats"

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
    }
]