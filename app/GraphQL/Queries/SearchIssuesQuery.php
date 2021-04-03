<?php

namespace App\GraphQL\Queries;

use App\Models\Issue;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class SearchIssuesQuery extends Query
{
    protected $attributes = [
        'name' => 'searchIssues',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('issue'));
    }

    public function args(): array
    {
        return [
            'query' => [
                'name' => 'query',
                'type' => Type::nonNull(Type::string()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $issues = Issue::where('name', 'ilike', '%' . $args['query'] . '%')
            ->limit(20)
            ->orderBy('name', 'asc')
            ->get();

        return $issues;
    }
}
