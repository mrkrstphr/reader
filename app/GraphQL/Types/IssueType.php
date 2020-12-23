<?php

namespace App\GraphQL\Types;

use App\Models\Issue;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class IssueType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Issue',
        'description' => 'An issue of a series',
        'model' => Issue::class,
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The id of the issue',
            ],
            'name' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The name of issue',
            ],
            'hasCover' => [
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'Does this issue have a cover image',
                'resolve' => function ($root) {
                    return !empty($root->cover_path);
                },
            ],
            'pageCount' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'Number of pages in this issue',
                'resolve' => function ($root) {
                    return $root->page_count;
                },
            ],
        ];
    }
}
