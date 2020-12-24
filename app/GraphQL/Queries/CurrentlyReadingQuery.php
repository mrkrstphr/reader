<?php

namespace App\GraphQL\Queries;

use App\Models\Issue;
use Rebing\GraphQL\Support\Facades\GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class CurrentlyReadingQuery extends Query
{
    protected $attributes = [
        'name' => 'currentlyReading',
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
        $TODO_FIXME_HARD_CODED_USER_ID = 1;

        return Issue::select('issues.*')
            ->join('user_issue_read_progress AS rp', 'rp.issue_id', '=', 'issues.id')
            ->whereRaw('rp.current_page < issues.page_count')
            ->where('user_id', $TODO_FIXME_HARD_CODED_USER_ID)
            ->orderBy('rp.updated_at', 'desc')
            ->limit(10)
            ->get();
    }
}
