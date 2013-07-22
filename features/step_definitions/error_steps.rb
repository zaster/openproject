#encoding: utf-8

#-- copyright
# OpenProject is a project management system.
#
# Copyright (C) 2012-2013 the OpenProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# See doc/COPYRIGHT.rdoc for more details.
#++

Then /^there should be an error message$/ do
  should have_selector('#errorExplanation')
end

Then /^I should see an error explanation stating "([^"]*)"$/ do |message|
  page.all(:css, ".errorExplanation li, .errorExplanation li *", :text => message).should_not be_empty
end

Then /^there should be a flash error message$/ do
  should have_selector('.flash.error')
end

Then /^there should be a flash notice message$/ do
  should have_selector('.flash.notice')
end

Then /^the flash message should contain "([^"]*)"$/ do |message|
  page.find(:css, '.flash > a').text.should include(message)
end

Then /^I should( not)? see (\d+) error message(?:s)?$/ do |negative, count|
  equal = page.all('.errorExplanation').count == count.to_i
  negative ? (equal.should_not be_true) : (equal.should be_true)
end
