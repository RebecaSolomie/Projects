#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <iostream>
#include <fstream>
#include <utility>
#include "repository.h"

RepositoryException::RepositoryException(std::string& message) : message(message) {}

const char* RepositoryException::what() const noexcept
{
	return this->message.c_str();
}

Repository::Repository(std::vector<Event>& repo, std::string& filename)
{
	this->admin_events = repo;
	this->filename = filename;
}

void Repository::initializeRepo() {
	this->loadFromFile();
}

void Repository::addEvent(const Event& e)
{
	std::string title = e.getTitle();
	int existing = this->findEventByTitle(title);
	if (existing != -1) {
		std::string error;
		error += std::string("The event already exists!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->admin_events.push_back(e);
	this->writeToFile();
}

void Repository::deleteEvent(int index)
{
	if (index == -1) {
		std::string error;
		error += std::string("The event does not exist!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->admin_events.erase(this->admin_events.begin() + index);
	this->writeToFile();
}

void Repository::updateEvent(int index, const Event& e)
{
	if (index == -1) {
		std::string error;
		error += std::string("The event does not exist!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	this->admin_events[index] = e;
	this->writeToFile();
}

int Repository::findEventByTitle(const std::string& title)
{
	int index = -1;
	std::vector<Event> events = this->admin_events;
	for (int i = 0; i < events.size(); i++)
	{
		if (events[i].getTitle() == title)
			index = i;
	}
	return index;
}

std::vector<Event>& Repository::getEvents()
{
	if (this->admin_events.empty())
	{
		std::string error;
		error += std::string("There are no events!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	return this->admin_events;
}

int Repository::getNumberOfEvents()
{
	if (this->admin_events.empty())
	{
		std::string error;
		error += std::string("There are no events!");
		if (!error.empty())
			throw RepositoryException(error);
	}
	return this->admin_events.size();
}


void Repository::writeToFile()
{
	if (!this->filename.empty())
	{
		std::ofstream file(this->filename);
		for (auto& e : this->admin_events)
		{
			file << e.getTitle() << ","
				<< e.getDescription() << ","
				<< e.getDateAndTime() << ","
				<< e.getPeopleGoing() << ","
				<< e.getLink() << "\n";
		}
		file.close();
	}
}

void Repository::loadFromFile()
{
	if (!this->filename.empty())
	{
		Event e;
		std::ifstream file(this->filename);
		while (file >> e)
		{
			if (std::find(this->admin_events.begin(), this->admin_events.end(), e) == this->admin_events.end())
				this->admin_events.push_back(e);
		}
		file.close();
	}
}

Repository::~Repository() = default;
