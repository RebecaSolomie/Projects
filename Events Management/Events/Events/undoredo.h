#pragma once
#include "repository.h"
#include "user_repo.h"


class UndoRedoAction {
public:
    virtual void undo() = 0;
    virtual void redo() = 0;
    virtual ~UndoRedoAction() = default;
};

class UndoRedoAdd : public UndoRedoAction {
private:
    Event addedEvent;
    Repository& repo;
public:
    UndoRedoAdd(const Event& event, Repository& newRepo);
    void undo() override;
    void redo() override;
    ~UndoRedoAdd() override = default;
};

class UndoRedoRemove : public UndoRedoAction {
private:
    Event removedEvent;
    Repository& repo;
public:
    UndoRedoRemove(const Event& event, Repository& newRepo);
    void undo() override;
    void redo() override;
    ~UndoRedoRemove() override = default;
};

class UndoRedoUpdate : public UndoRedoAction {
private:
    Event oldEvent;
    Event newEvent;
    Repository& repo;
public:
    UndoRedoUpdate(const Event& oldEvent, const Event& newEvent, Repository& newRepo);
    void undo() override;
    void redo() override;
    ~UndoRedoUpdate() override = default;
};

class UndoRedoUser : public UndoRedoAction {
private:
    Event addedWishEvent;
    Repository& repo;
    UserRepository* userRepo;
public:
    UndoRedoUser(const Event& addedWishEvent, Repository& newRepo, UserRepository* newUserRepo);
    void undo() override;
    void redo() override;
    ~UndoRedoUser() override = default;
};