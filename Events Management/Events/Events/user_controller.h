#pragma once
#include "repository.h"
#include "user_repo.h"
#include "CSVrepo.h"
#include "HTMLrepo.h"
#include "undoredo.h"
#include <memory>


class UserController {
private:
	Repository& repo;
	UserRepository* user_repo;
	bool repoTypeSelected;
	std::vector<std::shared_ptr<UndoRedoAction>> undoUser;
	std::vector<std::shared_ptr<UndoRedoAction>> redoUser;
public:
	UserController(Repository& repo1, UserRepository* user_repo1);
	explicit UserController(Repository& repo1);

	void addEventInUserController(const Event& e);
	void deleteEventInUserController(const std::string& title);

	UserRepository* getUserRepository() { return user_repo; }
	std::vector<Event> getEventsInUserController();
	int getNumberOfEventsInUserController();
	Event getEventByIndexInUserController(int index);
	Event getEventByTitleInUserController(const std::string& title);

	void repositoryType(const std::string& fileType);
	std::string& getFileController();

	void undoLastAction();
	void redoLastAction();
	void clearUndoRedo();

	~UserController();
};
