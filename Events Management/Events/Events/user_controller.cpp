#include "user_controller.h"
#include <algorithm>


UserController::UserController(Repository& repo1, UserRepository* user_repo1) : repo(repo1) {
	this->user_repo = user_repo1;
	this->repoTypeSelected = false;
}

UserController::UserController(Repository& repo1) : repo(repo1) {
	this->repoTypeSelected = false;
}

void UserController::addEventInUserController(const Event& e)
{
	this->user_repo->addUserEvent(e);
	std::shared_ptr<UndoRedoAction> action = std::make_shared<UndoRedoUser>(e, this->repo, this->user_repo);
	this->undoUser.push_back(action);
}

void UserController::deleteEventInUserController(const std::string& title)
{
	int index = -1;
	std::vector<Event> events = this->user_repo->getUserEvents();
	for (int i = 0; i < events.size(); i++)
	{
		if (events[i].getTitle() == title)
			index = i;
	}
	if (index == -1)
	{
		std::string error;
		error += std::string("Event not found!");
		if (!error.empty())
			throw UserException(error);
	}
	this->user_repo->deleteUserEvent(index);
}

std::vector<Event> UserController::getEventsInUserController()
{
	if (this->user_repo == nullptr) {
		std::string error;
		error += std::string("No events to show!");
		if (!error.empty())
			throw UserException(error);
	}
	return this->user_repo->getUserEvents();
}

int UserController::getNumberOfEventsInUserController()
{
	if (this->user_repo == nullptr) {
		std::string error;
		error += std::string("No events to show!");
		if (!error.empty())
			throw UserException(error);
	}
	return this->user_repo->getNumberOfEvents();
}

Event UserController::getEventByIndexInUserController(int index)
{
	return this->user_repo->getUserEvents()[index];
}

Event UserController::getEventByTitleInUserController(const std::string& title)
{
	std::vector<Event> events = this->user_repo->getUserEvents();
	for (int i = 0; i < events.size(); i++)
	{
		if (events[i].getTitle() == title)
			return events[i];
	}
	std::string error;
	error += std::string("Event not found!");
	throw UserException(error);
}

void UserController::repositoryType(const std::string& fileType)
{
	if (fileType == "CSV")
	{
		std::vector<Event> userVector;
		std::string userFile = "events.csv";
		auto* repo = new CSVRepository(userVector, userFile);
		this->user_repo = repo;
	}
	else if (fileType == "HTML")
	{
		std::vector<Event> userVector;
		std::string userFile = "events.html";
		auto* repo = new HTMLRepository(userVector, userFile);
		this->user_repo = repo;
	}
	else
	{
		std::string error;
		error += std::string("Invalid file type!");
		if (!error.empty())
			throw UserException(error);
	}
}

std::string& UserController::getFileController()
{
	return this->user_repo->getFile();
}


void UserController::undoLastAction() {
	if (this->undoUser.empty()) {
		std::string error;
		error += std::string("No more undoes left!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->undoUser.back()->undo();
	this->redoUser.push_back(this->undoUser.back());
	this->undoUser.pop_back();
}

void UserController::redoLastAction() {
	if (this->redoUser.empty()) {
		std::string error;
		error += std::string("No more redoes left!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->redoUser.back()->redo();
	this->undoUser.push_back(this->redoUser.back());
	this->redoUser.pop_back();
}

void UserController::clearUndoRedo() {
	this->undoUser.clear();
	this->redoUser.clear();
}


UserController::~UserController() = default;
