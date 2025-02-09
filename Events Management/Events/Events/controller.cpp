#include "controller.h"


Controller::Controller(Repository& repo) : admin_repo(repo) {}

void Controller::addEventInController(const Event& e)
{
	this->admin_repo.addEvent(e);
	std::shared_ptr<UndoRedoAction> action = std::make_shared<UndoRedoAdd>(e, this->admin_repo);
	this->undoAdmin.push_back(action);
}

void Controller::deleteEventInController(const std::string& title)
{
	int index = this->admin_repo.findEventByTitle(title);
	std::shared_ptr<UndoRedoAction> action = std::make_shared<UndoRedoRemove>(this->admin_repo.getEvents()[index], this->admin_repo);
	this->admin_repo.deleteEvent(index);
	this->undoAdmin.push_back(action);
}

void Controller::updateEventInController(const std::string& old_title, const std::string& new_title,
	const std::string& new_description, const std::string& new_date_time, int new_peopleGoing, const std::string& new_link)
{
	int index = this->admin_repo.findEventByTitle(old_title);
	Event new_event = Event(new_title, new_description, new_date_time, new_peopleGoing, new_link);
	std::shared_ptr<UndoRedoAction> action = std::make_shared<UndoRedoUpdate>(this->admin_repo.getEvents()[index], new_event, this->admin_repo);
	this->admin_repo.updateEvent(index, new_event);
	this->undoAdmin.push_back(action);
}

std::vector<Event> Controller::getEventsInController()
{
	return this->admin_repo.getEvents();
}

int Controller::getNumberOfEventsInController()
{
	return this->admin_repo.getNumberOfEvents();
}

Event Controller::getEventByIndexInController(int index)
{
	return this->admin_repo.getEvents()[index];
}

int Controller::getEventIndex(const std::string& title)
{
	return this->admin_repo.findEventByTitle(title);
}

Event Controller::getEventByTitleInController(const std::string& title)
{
	int index = this->admin_repo.findEventByTitle(title);
	return this->admin_repo.getEvents()[index];
}

std::vector<Event> Controller::getEventsByMonthInController(std::string month) const
{
	int length = this->admin_repo.getNumberOfEvents();
	std::vector<Event> events = this->admin_repo.getEvents();
	std::vector<Event> events_by_month(length);
	int count = 0;
	for (int i = 0; i < length; i++)
	{
		if (events[i].getDateAndTime().substr(3, 2) == month)
		{
			events_by_month[count] = events[i];
			count++;
		}
	}
	return events_by_month;
}

int Controller::getNumberOfEventsByMonthInController(std::string month) const
{
	int length = this->admin_repo.getNumberOfEvents();
	std::vector<Event> events = this->admin_repo.getEvents();
	int count = 0;
	for (int i = 0; i < length; i++)
	{
		if (events[i].getDateAndTime().substr(3, 2) == month)
			count++;
	}
	return count;
}


void Controller::undoLastAction() {
	if (this->undoAdmin.empty()) {
		std::string error;
		error += std::string("No more undoes left!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->undoAdmin.back()->undo();
	this->redoAdmin.push_back(this->undoAdmin.back());
	this->undoAdmin.pop_back();
}

void Controller::redoLastAction() {
	if (this->redoAdmin.empty()) {
		std::string error;
		error += std::string("No more redoes left!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->redoAdmin.back()->redo();
	this->undoAdmin.push_back(this->redoAdmin.back());
	this->redoAdmin.pop_back();
}

void Controller::clearUndoRedo() {
	this->undoAdmin.clear();
	this->redoAdmin.clear();
}


Controller::~Controller() = default;
