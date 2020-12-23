<?php

namespace App\GraphQL\Queries;

use App\Models\Issue;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class IssueDetailsQuery extends Query
{
    protected $attributes = [
        'name' => 'issue',
    ];

    public function type(): Type
    {
        return GraphQL::type('issue');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
            ],
        ];
    }

    public function resolve($root, $args)
    {
        return Issue::find($args['id']);
    }
}
