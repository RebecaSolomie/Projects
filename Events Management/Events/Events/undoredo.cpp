#include "undoredo.h"

UndoRedoAdd::UndoRedoAdd(const Event& event, Repository& newRepo) : addedEvent(event), repo(newRepo) {}

void UndoRedoAdd::undo()
{
	repo.deleteEvent(repo.findEventByTitle(addedEvent.getTitle()));
}

void UndoRedoAdd::redo()
{
	repo.addEvent(addedEvent);
}


UndoRedoRemove::UndoRedoRemove(const Event& event, Repository& newRepo) : removedEvent(event), repo(newRepo) {}

void UndoRedoRemove::undo()
{
	repo.addEvent(removedEvent);
}

void UndoRedoRemove::redo()
{
	repo.deleteEvent(repo.findEventByTitle(removedEvent.getTitle()));
}


UndoRedoUpdate::UndoRedoUpdate(const Event& oldEvent, const Event& newEvent, Repository& newRepo) : oldEvent(oldEvent), newEvent(newEvent), repo(newRepo) {}

void UndoRedoUpdate::undo()
{
	repo.updateEvent(repo.findEventByTitle(newEvent.getTitle()), oldEvent);
}

void UndoRedoUpdate::redo()
{
	repo.updateEvent(repo.findEventByTitle(oldEvent.getTitle()), newEvent);
}


UndoRedoUser::UndoRedoUser(const Event& addedWishEvent, Repository& newRepo, UserRepository* newUserRepo) : addedWishEvent(addedWishEvent), repo(newRepo), userRepo(newUserRepo) {}

void UndoRedoUser::undo()
{
	int index = -1;
	for (int i = 0; i < userRepo->getNumberOfEvents(); i++)
	{
		if (userRepo->getUserEvents()[i].getTitle() == addedWishEvent.getTitle())
			index = i;
	}
	userRepo->deleteUserEvent(index);
}

void UndoRedoUser::redo()
{
	userRepo->addUserEvent(addedWishEvent);
}