<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    /**
     * The model instance.
     */
    protected Model $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Find a record by its primary key.
     *
     * @param  mixed  $id
     */
    public function find($id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->model->with($relations)->find($id, $columns);
    }

    /**
     * Find a record or throw a ModelNotFoundException.
     *
     * @param  mixed  $id
     */
    public function findOrFail($id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->model->with($relations)->findOrFail($id, $columns);
    }

    /**
     * Get all records.
     */
    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->with($relations)->get($columns);
    }

    /**
     * Paginate records.
     */
    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->model->with($relations)->paginate($perPage, $columns);
    }

    /**
     * Create a new record.
     */
    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    /**
     * Update an existing record.
     *
     * @param  mixed  $id
     */
    public function update($id, array $attributes): Model
    {
        $record = $this->findOrFail($id);
        $record->update($attributes);

        return $record;
    }

    /**
     * Delete a record by ID.
     *
     * @param  mixed  $id
     */
    public function delete($id): bool
    {
        $record = $this->findOrFail($id);

        return $record->delete();
    }
}
