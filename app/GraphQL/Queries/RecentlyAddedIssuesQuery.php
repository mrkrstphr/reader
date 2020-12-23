<?php

namespace App\GraphQL\Queries;

use App\Models\Issue;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class RecentlyAddedIssuesQuery extends Query
{
    protected $attributes = [
        'name' => 'recentlyAddedIssues',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('issue'));
    }

    public function args(): array
    {
        // TODO FIXME allow configuring a limit (per page, too?)
        return [];
    }

    public function resolve()
    {
        return Issue::orderBy('created_at', 'desc')
            ->limit(20)
            ->get();
    }
}
