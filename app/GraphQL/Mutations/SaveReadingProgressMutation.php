<?php

namespace App\GraphQL\Mutations;

use App\Models\Issue;
use App\Models\UserIssueReadProgress;
use Closure;
use GraphQL;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Rebing\GraphQL\Support\Mutation;

class SaveReadingProgressMutation extends Mutation
{
    protected $attributes = [
        'name' => 'saveReadingProgress'
    ];

    public function type(): Type
    {
        return GraphQL::type('issue');
    }

    public function args(): array
    {
        return [
            'id' => ['name' => 'id', 'type' => Type::nonNull(Type::id())],
            'page' => ['name' => 'page', 'type' => Type::nonNull(Type::int())]
        ];
    }

    public function resolve($root, $args)
    {
        $issue = Issue::findOrFail($args['id']);

        $TODO_FIXME_HARD_CODED_USER_ID = 1;

        $userIssueProgress = UserIssueReadProgress::where('user_id', $TODO_FIXME_HARD_CODED_USER_ID)
            ->where('issue_id', $issue->id)
            ->first();

        if (!$userIssueProgress) {
            $userIssueProgress = new UserIssueReadProgress();
            $userIssueProgress->issue_id = $issue->id;
            $userIssueProgress->user_id = $TODO_FIXME_HARD_CODED_USER_ID;
        }

        $userIssueProgress->current_page = $args['page'];
        $userIssueProgress->save();

        return $issue;
    }
}
