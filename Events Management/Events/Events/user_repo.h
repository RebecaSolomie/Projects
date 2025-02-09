#pragma once
#include <vector>
#include "domain.h"


class UserRepository {
protected:
	std::vector<Event> user_events;
	std::string file_name;
public:
	explicit UserRepository(std::vector<Event>& user_events);
	UserRepository();

	virtual void addUserEvent(const Event& event) = 0;
	virtual void deleteUserEvent(int index) = 0;

	virtual std::vector<Event>& getUserEvents() = 0;
	virtual int getNumberOfEvents() = 0;

	virtual void writeToFile() = 0;
	virtual std::string& getFile() = 0;

	~UserRepository();
};


class UserException : public std::exception {
private:
	std::string message;
public:
	explicit UserException(std::string& message);
	const char* what() const noexcept override;
};
