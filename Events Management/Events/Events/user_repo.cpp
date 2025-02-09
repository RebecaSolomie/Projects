#include <fstream>
#include "user_repo.h"


UserException::UserException(std::string& message) : message(message) {}

const char* UserException::what() const noexcept {
	return message.c_str();
}

UserRepository::UserRepository() = default;

UserRepository::UserRepository(std::vector<Event>& user_events)
{
	this->user_events = user_events;
}

UserRepository::~UserRepository() = default;